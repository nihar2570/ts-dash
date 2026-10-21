import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { Layers, Hexagon, Map as MapIcon, Crosshair, Maximize2, Minimize2, Plus, Minus, RotateCcw, Palette } from 'lucide-react';
import type { ConstituencyResult, Year, ViewMode, SeeepcDataset } from '../types';
import { getPartyColor, getDistrictGrey, getPastelPartyColor } from '../types';
import { ANDHRA_HEX_COORDINATES } from '../data/hexCoordinates';

export type ThematicLayerKey =
  | 'NONE'
  | 'kapu'
  | 'kamma'
  | 'reddy'
  | 'bc_turpu_kapu'
  | 'bc_yadava'
  | 'bc_settibalija_goud'
  | 'sc_mala'
  | 'sc_madiga_relli'
  | 'minority_muslim'
  | 'st_tribal'
  | 'youth_18_25';

export const THEMATIC_LAYERS_META: Record<ThematicLayerKey, { label: string; icon: string; description: string }> = {
  NONE: { label: 'Electoral Baseline', icon: '🗳️', description: 'Standard Party / Margin / District view' },
  kapu: { label: 'Kapu / Balija / Telaga', icon: '🦁', description: 'Decisive demographic across Godavari, Krishna & Coastal AP' },
  kamma: { label: 'Kamma', icon: '🌾', description: 'Strong concentration in Krishna, Guntur & Godavari deltas' },
  reddy: { label: 'Reddy', icon: '🏰', description: 'Major agrarian & political bloc across Rayalaseema & Palnadu' },
  bc_turpu_kapu: { label: 'BC Turpu Kapu', icon: '🌱', description: 'Core OBC demographic across Srikakulam & Vizianagaram' },
  bc_yadava: { label: 'BC Yadava / Golla', icon: '🐄', description: 'Substantial presence across Rayalaseema & Coastal belts' },
  bc_settibalija_goud: { label: 'BC Settibalija / Goud', icon: '🌴', description: 'Key OBC community in Konaseema & Godavari' },
  sc_mala: { label: 'SC Mala', icon: '🏛️', description: 'Concentration in Godavari, Krishna & Central Coastal ACs' },
  sc_madiga_relli: { label: 'SC Madiga / Relli', icon: '👞', description: 'Significant across Rayalaseema & Prakasam reserved seats' },
  minority_muslim: { label: 'Muslim Minorities', icon: '🌙', description: 'Concentration in Rayalaseema (Kurnool, Kadapa) & Guntur urban' },
  st_tribal: { label: 'ST Tribal (Koya/Yanadi)', icon: '🏹', description: 'Agency belt concentration in ASR, Parvathipuram & Polavaram' },
  youth_18_25: { label: 'Youth (18-25)', icon: '🎓', description: 'Young first-time voter demographic density' },
};

export function getDemographicColor(pct: number): string {
  if (pct <= 4) return '#f1f5f9';
  if (pct <= 8) return '#c7d2fe';
  if (pct <= 14) return '#818cf8';
  if (pct <= 20) return '#6366f1';
  if (pct <= 26) return '#4f46e5';
  return '#312e81'; // 26%+
}

interface MapProps {
  geoJsonData: any;
  districtGeoJsonData?: any;
  yearResults: Record<string, ConstituencyResult>;
  selectedAcNo: number | null;
  onSelectAc: (acNo: number) => void;
  viewMode: ViewMode;
  selectedYear: Year;
  seeepcData?: SeeepcDataset | null;
}

export const AndhraMap: React.FC<MapProps> = ({
  geoJsonData,
  districtGeoJsonData,
  yearResults,
  selectedAcNo,
  onSelectAc,
  viewMode,
  selectedYear,
  seeepcData,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const districtLayerRef = useRef<L.GeoJSON | null>(null);
  const districtLabelsLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const hasFittedBoundsRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);

  // District border and label display state
  const [showDistrictBorders, setShowDistrictBorders] = useState<boolean>(true);
  const [showDistrictLabels, setShowDistrictLabels] = useState<boolean>(false);

  // Basemap canvas state: 'light' (Esri World Light Gray Base, default) & 'osm' (OpenStreetMap)
  const [basemap, setBasemap] = useState<'light' | 'osm'>(() => {
    const saved = (localStorage.getItem('andhra_basemap') || localStorage.getItem('telangana_basemap')) as 'light' | 'osm' | null;
    if (saved && ['light', 'osm'].includes(saved)) {
      return saved;
    }
    return 'light';
  });

  // Google Maps-style Floating Layers & Settings Menu
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const layersMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layersMenuRef.current) {
      try {
        L.DomEvent.disableClickPropagation(layersMenuRef.current);
        L.DomEvent.disableScrollPropagation(layersMenuRef.current);
      } catch {
        // Fallback safe
      }
    }

    if (!showLayersMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      const path = e.composedPath ? e.composedPath() : [];
      if (layersMenuRef.current) {
        if (path.length > 0 && path.includes(layersMenuRef.current)) return;
        if (layersMenuRef.current.contains(e.target as Node)) return;
      }
      setShowLayersMenu(false);
    };

    // Attach with small delay so the opening click event doesn't immediately dismiss the popover
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
    }, 60);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLayersMenu]);

  // Representation Mode: Geographic Map vs Equal-Area Hex Cartogram (#6)
  const [mapType, setMapType] = useState<'geographic' | 'hex_cartogram'>('geographic');

  // Thematic Demographic Heatmap Layer (#7)
  const [thematicLayer, setThematicLayer] = useState<ThematicLayerKey>('NONE');

  // Hover state for Hex Cartogram
  const [hoveredHexAc, setHoveredHexAc] = useState<number | null>(null);

  // Equal-Area Hex Cartogram Zoom, Pan & Color Scheme states
  const [hexZoom, setHexZoom] = useState<number>(1);
  const [hexPan, setHexPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHexDragging, setIsHexDragging] = useState<boolean>(false);
  const [hexColorMode, setHexColorMode] = useState<'pastel' | 'vibrant'>('pastel');
  const hexPanStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);
  const didHexDragRef = useRef<boolean>(false);
  const hexContainerRef = useRef<HTMLDivElement>(null);

  // Wheel zoom with passive: false to prevent document scroll
  useEffect(() => {
    const el = hexContainerRef.current;
    if (!el || mapType !== 'hex_cartogram') return;
    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setHexZoom((prev) => {
        const next = Math.min(3.5, Math.max(0.75, Number((prev + delta).toFixed(2))));
        if (next <= 1 && prev > 1) {
          setHexPan({ x: 0, y: 0 });
        }
        return next;
      });
    };
    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleNativeWheel);
  }, [mapType]);

  const handleHexZoomIn = useCallback(() => {
    setHexZoom((z) => Math.min(3.5, Number((z + 0.25).toFixed(2))));
  }, []);

  const handleHexZoomOut = useCallback(() => {
    setHexZoom((z) => {
      const next = Math.max(0.75, Number((z - 0.25).toFixed(2)));
      if (next <= 1) setHexPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleHexReset = useCallback(() => {
    setHexZoom(1);
    setHexPan({ x: 0, y: 0 });
  }, []);

  const handleHexMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary mouse button
    hexPanStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: hexPan.x,
      panY: hexPan.y,
    };
    didHexDragRef.current = false;
    setIsHexDragging(true);
  };

  const handleHexMouseMove = (e: React.MouseEvent) => {
    if (!hexPanStartRef.current) return;
    const dx = (e.clientX - hexPanStartRef.current.clientX) / hexZoom;
    const dy = (e.clientY - hexPanStartRef.current.clientY) / hexZoom;
    if (Math.hypot(dx, dy) > 4) {
      didHexDragRef.current = true;
    }
    setHexPan({
      x: hexPanStartRef.current.panX + dx,
      y: hexPanStartRef.current.panY + dy,
    });
  };

  const handleHexMouseUp = () => {
    hexPanStartRef.current = null;
    setIsHexDragging(false);
  };

  // Fullscreen view state & refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (wrapperRef.current?.requestFullscreen) {
          wrapperRef.current.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback to CSS fullscreen overlay
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen]);

  // Trigger Leaflet resize on fullscreen toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ pan: false });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Andhra Pradesh Assembly geographic centroid [15.90, 80.76]
    const map = L.map(mapContainerRef.current, {
      center: [15.90, 80.76],
      zoom: 7,
      minZoom: 6,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: false,
    });

    // Create a dedicated overlay pane for district boundaries above constituencies but below tooltips
    if (!map.getPane('districtPane')) {
      const districtPane = map.createPane('districtPane');
      districtPane.style.zIndex = '450';
      districtPane.style.pointerEvents = 'none';
    }

    if (!map.getPane('districtLabelPane')) {
      const labelPane = map.createPane('districtLabelPane');
      labelPane.style.zIndex = '460';
      labelPane.style.pointerEvents = 'none';
    }

    // Attach ResizeObserver to keep Leaflet synchronized with container layout shifts
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  const attachTileLayer = useCallback(
    (map: L.Map, targetBasemap: 'light' | 'osm') => {
      if (tileLayerRef.current) {
        try {
          map.removeLayer(tileLayerRef.current);
        } catch {
          // Safe removal
        }
        tileLayerRef.current = null;
      }

      let layer: L.TileLayer;

      if (targetBasemap === 'osm') {
        layer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
          }
        );
      } else {
        const cartoKey = import.meta.env.VITE_CARTO_API_KEY;
        if (cartoKey) {
          // CARTO Positron: crisp light basemap powered by official API key
          layer = L.tileLayer(
            `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`,
            {
              maxZoom: 19,
              subdomains: 'abcd',
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }
          );
        } else {
          // Esri World Light Gray Base fallback if no CARTO API key is provided
          layer = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            {
              maxZoom: 16,
              attribution: 'Tiles &copy; Esri',
            }
          );
        }
      }

      layer.addTo(map);
      tileLayerRef.current = layer;
    },
    []
  );

  // Update Tile Layer when basemap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;
    attachTileLayer(map, basemap);
  }, [mapReady, basemap, attachTileLayer]);

  // Invalidate Leaflet size and ensure tile layer is attached when switching back to geographic mode
  useEffect(() => {
    if (mapType === 'geographic' && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      if (mapContainerRef.current && !mapContainerRef.current.classList.contains('leaflet-container')) {
        mapContainerRef.current.classList.add('leaflet-container');
      }
      const timer = setTimeout(() => {
        if (!mapInstanceRef.current) return;
        map.invalidateSize({ pan: false });
        if (!tileLayerRef.current || !map.hasLayer(tileLayerRef.current)) {
          attachTileLayer(map, basemap);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [mapType, basemap, attachTileLayer]);

  const handleBasemapChange = (type: 'light' | 'osm') => {
    setBasemap(type);
    localStorage.setItem('andhra_basemap', type);
  };

  // Update District Boundaries and Labels Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (districtLayerRef.current) {
      map.removeLayer(districtLayerRef.current);
      districtLayerRef.current = null;
    }

    if (districtLabelsLayerRef.current) {
      map.removeLayer(districtLabelsLayerRef.current);
      districtLabelsLayerRef.current = null;
    }

    if (!districtGeoJsonData) return;

    // 1. District Outer Borders Layer grouping constituencies
    if (showDistrictBorders) {
      const distLayer = L.geoJSON(districtGeoJsonData, {
        pane: 'districtPane',
        interactive: false,
        style: () => {
          return {
            fill: false,
            color: '#cbd5e1', // Uniform light grey border for all districts
            weight: 2.0,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
          };
        },
      });

      distLayer.addTo(map);
      districtLayerRef.current = distLayer;
    }

    // 2. District Center Labels
    if (showDistrictLabels && districtGeoJsonData.features) {
      const labelGroup = L.layerGroup([], { pane: 'districtLabelPane' });

      districtGeoJsonData.features.forEach((feature: any) => {
        const center = feature.properties?.center;
        const distName = feature.properties?.DIST_NAME;
        if (center && distName) {
          const marker = L.marker([center[1], center[0]], {
            pane: 'districtLabelPane',
            interactive: false,
            icon: L.divIcon({
              className: 'district-label-container',
              html: `<div class="district-map-label">${distName}</div>`,
              iconSize: [120, 20],
              iconAnchor: [60, 10],
            }),
          });
          labelGroup.addLayer(marker);
        }
      });

      labelGroup.addTo(map);
      districtLabelsLayerRef.current = labelGroup;
    }
  }, [mapReady, districtGeoJsonData, showDistrictBorders, showDistrictLabels]);

  // Update GeoJSON Layer when data, year, or view mode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady || !geoJsonData || !yearResults) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    const getFeatureStyle = (feature: any) => {
      const acNo = feature?.properties?.AC_NO;
      const res = yearResults[String(acNo)];
      const isSelected = selectedAcNo === acNo;

      if (!res) {
        return {
          fillColor: isSelected ? '#334155' : '#94a3b8',
          weight: isSelected ? 3 : 1,
          opacity: 1,
          color: isSelected ? '#0f172a' : '#cbd5e1',
          fillOpacity: isSelected ? 0.95 : 0.4,
        };
      }

      let fillColor = '#94a3b8';

      if (thematicLayer !== 'NONE' && seeepcData?.constituencies) {
        const acInfo = seeepcData.constituencies[String(acNo)];
        const casteProf = acInfo?.caste_profile as unknown as Record<string, number> | undefined;
        const ageProf = acInfo?.age_profile as unknown as Record<string, number> | undefined;
        let pct = 0;
        if (casteProf && thematicLayer in casteProf) {
          pct = casteProf[thematicLayer] || 0;
        } else if (ageProf && thematicLayer in ageProf) {
          pct = ageProf[thematicLayer] || 0;
        }
        fillColor = getDemographicColor(pct);
      } else if (isSelected) {
        fillColor = '#334155'; // Darker grey for selected AC
      } else if (viewMode === 'winner') {
        fillColor = getPartyColor(res.winner.party);
      } else if (viewMode === 'margin') {
        // Color scale based on margin percentage
        const marginPct = res.margin_pct;
        if (marginPct < 5) fillColor = '#fef08a'; // < 5% tight battle
        else if (marginPct < 15) fillColor = '#fed7aa'; // 5-15% moderate
        else if (marginPct < 25) fillColor = '#fb923c'; // 15-25% comfortable
        else fillColor = '#ea580c'; // 25%+ landslide
      } else if (viewMode === 'swing') {
        if (!res.swing) {
          fillColor = getPartyColor(res.winner.party);
        } else if (res.swing.status === 'HOLD') {
          fillColor = '#64748b'; // Neutral gray for status quo
        } else {
          fillColor = getPartyColor(res.winner.party); // Vibrant color for seat change
        }
      } else if (viewMode === 'district') {
        const distName = res.district || feature?.properties?.DIST_NAME_33 || feature?.properties?.DIST_NAME || '';
        fillColor = getDistrictGrey(distName);
      }

      return {
        fillColor,
        weight: isSelected ? 3 : 1,
        opacity: 1,
        color: isSelected ? '#0f172a' : (viewMode === 'district' ? '#f8fafc' : '#ffffff'),
        fillOpacity: isSelected ? 0.95 : (viewMode === 'district' ? 0.92 : 0.8),
      };
    };

    const layer = L.geoJSON(geoJsonData, {
      style: getFeatureStyle,
      onEachFeature: (feature, l) => {
        const acNo = feature?.properties?.AC_NO;
        const res = yearResults[String(acNo)];
        const acName = res?.ac_name || feature?.properties?.AC_NAME || `AC #${acNo}`;
        const district = res?.district || feature?.properties?.DIST_NAME || '';

        // Tooltip
        let tooltipHtml = `
          <div class="space-y-1">
            <div class="font-bold text-sm tracking-wide text-white border-b border-slate-700 pb-1">
              #${acNo} ${acName}
              <span class="text-xs font-normal text-slate-400 block">${district} District</span>
            </div>
        `;

        if (res) {
          tooltipHtml += `
            <div class="text-xs space-y-0.5 pt-1">
              <div class="flex justify-between items-center gap-3">
                <span class="text-slate-300">Winner (${selectedYear}):</span>
                <span class="font-bold" style="color: ${getPartyColor(res.winner.party)}">${res.winner.party}</span>
              </div>
              <div class="text-slate-200 truncate max-w-[200px]">${res.winner.candidate}</div>
              <div class="flex justify-between items-center gap-3 text-slate-400">
                <span>Margin:</span>
                <span class="text-white font-medium">${res.margin.toLocaleString()} (${res.margin_pct}%)</span>
              </div>
              <div class="flex justify-between items-center gap-3 text-slate-400">
                <span>Runner-up:</span>
                <span class="text-slate-300">${res.runner_up.party} (${res.runner_up.candidate.split(' ')[0]})</span>
              </div>
              ${
                res.swing
                  ? `<div class="mt-1 pt-1 border-t border-slate-700/60 text-[11px] ${
                      res.swing.status === 'GAIN' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                    }">
                      ${res.swing.status === 'GAIN' ? `★ Gained from ${res.swing.gained_from}` : `Held by ${res.winner.party}`}
                    </div>`
                  : ''
              }
            </div>
          `;
        } else {
          tooltipHtml += `<div class="text-xs text-slate-400">No data available</div>`;
        }

        if (thematicLayer !== 'NONE' && seeepcData?.constituencies) {
          const acInfo = seeepcData.constituencies[String(acNo)];
          const casteProf = acInfo?.caste_profile as unknown as Record<string, number> | undefined;
          const ageProf = acInfo?.age_profile as unknown as Record<string, number> | undefined;
          let pct = 0;
          if (casteProf && thematicLayer in casteProf) {
            pct = casteProf[thematicLayer] || 0;
          } else if (ageProf && thematicLayer in ageProf) {
            pct = ageProf[thematicLayer] || 0;
          }
          tooltipHtml += `
            <div class="mt-1.5 pt-1.5 border-t border-indigo-500/30 flex items-center justify-between text-xs font-semibold">
              <span class="text-indigo-300 flex items-center gap-1">
                <span>${THEMATIC_LAYERS_META[thematicLayer].icon}</span>
                <span>${THEMATIC_LAYERS_META[thematicLayer].label}:</span>
              </span>
              <span class="font-mono font-bold text-white bg-indigo-900/80 px-1.5 py-0.5 rounded">${pct}%</span>
            </div>
          `;
        }

        tooltipHtml += `</div>`;

        l.bindTooltip(tooltipHtml, {
          className: 'custom-tooltip',
          sticky: true,
          direction: 'auto',
        });

        // Click interaction
        l.on({
          click: () => {
            onSelectAc(acNo);
          },
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({
              weight: 2.5,
              color: '#0f172a',
              fillOpacity: 0.95,
            });
            target.bringToFront();
          },
          mouseout: (e) => {
            const target = e.target;
            layer.resetStyle(target);
          },
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = layer;

    // Bring selected AC to front so its darker grey fill and border are not obscured
    if (selectedAcNo && layer) {
      layer.eachLayer((l: any) => {
        if (l.feature?.properties?.AC_NO === selectedAcNo) {
          l.bringToFront();
        }
      });
    }

    // Fit bounds initially with brief delay ensuring DOM layout has computed dimensions
    if (!hasFittedBoundsRef.current && geoJsonData.features && geoJsonData.features.length > 0) {
      setTimeout(() => {
        if (mapInstanceRef.current && layer) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.fitBounds(layer.getBounds(), { padding: [20, 20], animate: false });
          hasFittedBoundsRef.current = true;
        }
      }, 100);
    }
  }, [mapReady, geoJsonData, yearResults, selectedAcNo, viewMode, selectedYear, onSelectAc, thematicLayer, seeepcData]);

  // One-click Re-center handler to reset map view directly to Andhra Pradesh boundary
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    const layer = geoJsonLayerRef.current;
    if (map && layer) {
      map.invalidateSize();
      map.fitBounds(layer.getBounds(), { padding: [20, 20], animate: true });
    }
  };

  // Memoized 175-Constituency Hexagon Grid Items (#6 Equal-Area Hex Cartogram)
  const hexItems = useMemo(() => {
    return Object.entries(ANDHRA_HEX_COORDINATES).map(([acNoStr, coord]) => {
      const acNo = Number(acNoStr);
      const res = yearResults[String(acNo)];
      const acName = res?.ac_name || `AC #${acNo}`;
      const district = res?.district || '';

      // Pointy-topped hexagon center
      const cx = 45 + coord.col * 49 + (coord.row % 2 === 1 ? 24.5 : 0);
      const cy = 40 + coord.row * 41;
      const r = 24;

      // Hexagon vertices
      const points = [0, 1, 2, 3, 4, 5]
        .map((i) => {
          const angle = (Math.PI / 180) * (60 * i + 30);
          return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
        })
        .join(' ');

      // Determine fill, stroke and text color
      let fillColor = '#64748b';
      let strokeColor = hexColorMode === 'pastel' ? '#cbd5e1' : '#1e293b';
      let textColor = hexColorMode === 'pastel' ? '#0f172a' : '#ffffff';
      let demographicPct = 0;

      if (thematicLayer !== 'NONE' && seeepcData?.constituencies) {
        const acInfo = seeepcData.constituencies[String(acNo)];
        const casteProf = acInfo?.caste_profile as unknown as Record<string, number> | undefined;
        const ageProf = acInfo?.age_profile as unknown as Record<string, number> | undefined;
        if (casteProf && thematicLayer in casteProf) {
          demographicPct = casteProf[thematicLayer] || 0;
        } else if (ageProf && thematicLayer in ageProf) {
          demographicPct = ageProf[thematicLayer] || 0;
        }
        fillColor = getDemographicColor(demographicPct);
        strokeColor = hexColorMode === 'pastel' ? '#a5b4fc' : '#1e293b';
        textColor = demographicPct > 18 ? '#ffffff' : '#0f172a';
      } else if (res) {
        if (viewMode === 'winner') {
          if (hexColorMode === 'pastel') {
            const p = getPastelPartyColor(res.winner.party);
            fillColor = p.fill;
            strokeColor = p.stroke;
            textColor = '#0f172a';
          } else {
            fillColor = getPartyColor(res.winner.party);
            strokeColor = '#1e293b';
            textColor = '#ffffff';
          }
        } else if (viewMode === 'margin') {
          const m = res.margin_pct;
          if (hexColorMode === 'pastel') {
            if (m < 5) {
              fillColor = '#fef9c3'; strokeColor = '#facc15'; textColor = '#713f12';
            } else if (m < 15) {
              fillColor = '#fed7aa'; strokeColor = '#fb923c'; textColor = '#7c2d12';
            } else if (m < 25) {
              fillColor = '#fdba74'; strokeColor = '#f97316'; textColor = '#7c2d12';
            } else {
              fillColor = '#fca5a5'; strokeColor = '#f87171'; textColor = '#7f1d1d';
            }
          } else {
            if (m < 5) fillColor = '#fef08a';
            else if (m < 15) fillColor = '#fed7aa';
            else if (m < 25) fillColor = '#fb923c';
            else fillColor = '#ea580c';
            strokeColor = '#1e293b';
            textColor = (m < 15) ? '#0f172a' : '#ffffff';
          }
        } else if (viewMode === 'swing') {
          if (!res.swing || res.swing.status === 'HOLD') {
            fillColor = hexColorMode === 'pastel' ? '#f1f5f9' : '#64748b';
            strokeColor = hexColorMode === 'pastel' ? '#cbd5e1' : '#1e293b';
            textColor = hexColorMode === 'pastel' ? '#475569' : '#ffffff';
          } else {
            if (hexColorMode === 'pastel') {
              const p = getPastelPartyColor(res.winner.party);
              fillColor = p.fill;
              strokeColor = p.stroke;
              textColor = '#0f172a';
            } else {
              fillColor = getPartyColor(res.winner.party);
              strokeColor = '#1e293b';
              textColor = '#ffffff';
            }
          }
        } else if (viewMode === 'district') {
          fillColor = getDistrictGrey(district);
          strokeColor = hexColorMode === 'pastel' ? '#94a3b8' : '#1e293b';
          textColor = '#0f172a';
        }
      }

      return {
        acNo,
        acName,
        district,
        res,
        cx,
        cy,
        points,
        fillColor,
        strokeColor,
        textColor,
        demographicPct,
      };
    });
  }, [yearResults, thematicLayer, seeepcData, viewMode, hexColorMode]);

  const hoveredItem = useMemo(() => {
    if (!hoveredHexAc) return null;
    return hexItems.find((h) => h.acNo === hoveredHexAc) || null;
  }, [hoveredHexAc, hexItems]);

  return (
    <div
      ref={wrapperRef}
      className={
        isFullscreen
          ? `fixed inset-0 z-[2500] w-screen h-screen ${mapType === 'hex_cartogram' ? 'bg-white' : 'bg-slate-950'} p-2 sm:p-4 flex flex-col overflow-hidden`
          : `relative w-full h-full min-h-[580px] ${mapType === 'hex_cartogram' ? 'bg-white' : 'bg-slate-950'} rounded-xl overflow-hidden border border-slate-200 shadow-inner`
      }
    >
      {/* 1. Leaflet Geographic Map Canvas Container */}
      <div
        className={`w-full h-full ${mapType === 'hex_cartogram' ? 'invisible pointer-events-none' : ''}`}
        style={{ minHeight: isFullscreen ? '100%' : '580px' }}
      >
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%', minHeight: isFullscreen ? '100%' : '580px' }}
        />
      </div>

      {/* 2. Equal-Area Hex Cartogram Canvas (#6) */}
      {mapType === 'hex_cartogram' && (
        <div
          ref={hexContainerRef}
          className="absolute inset-0 z-[500] flex flex-col items-center justify-center p-3 bg-white select-none overflow-hidden"
        >
          <svg
            className="w-full h-full max-w-[760px] max-h-[620px] select-none"
            viewBox="0 0 650 575"
            onMouseDown={handleHexMouseDown}
            onMouseMove={handleHexMouseMove}
            onMouseUp={handleHexMouseUp}
            onMouseLeave={handleHexMouseUp}
            style={{ cursor: isHexDragging ? 'grabbing' : hexZoom > 1 ? 'grab' : 'default' }}
          >
            <defs>
              {/* Subtle background dot grid pattern */}
              <pattern id="hex-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.9" fill="#e2e8f0" />
              </pattern>
            </defs>

            {/* Background texture */}
            <rect width="650" height="575" fill="url(#hex-dot-grid)" />

            {/* Scaled & Translated Hex Grid Group */}
            <g transform={`translate(${325 + hexPan.x}, ${287.5 + hexPan.y}) scale(${hexZoom}) translate(-325, -287.5)`}>
              {hexItems.map((item) => {
                const isSelected = selectedAcNo === item.acNo;
                const isHovered = hoveredHexAc === item.acNo;
                const shortName = item.acName.replace(/\s*\(.*\)/, '').slice(0, 7);

                return (
                  <g
                    key={item.acNo}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (didHexDragRef.current) return;
                      onSelectAc(item.acNo);
                    }}
                    onMouseEnter={() => setHoveredHexAc(item.acNo)}
                    onMouseLeave={() => setHoveredHexAc(null)}
                    className="cursor-pointer transition-transform duration-150"
                  >
                    {/* Glowing selection outline */}
                    {isSelected && (
                      <polygon
                        points={item.points}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="5"
                        strokeOpacity="0.8"
                        className="animate-pulse"
                      />
                    )}

                    {/* Base Hexagon Tile */}
                    <polygon
                      points={item.points}
                      fill={item.fillColor}
                      stroke={
                        isSelected
                          ? '#2563eb'
                          : isHovered
                          ? (hexColorMode === 'pastel' ? '#0f172a' : '#ffffff')
                          : item.strokeColor
                      }
                      strokeWidth={isSelected ? 3 : isHovered ? 2.2 : 1.3}
                      fillOpacity={isHovered ? 1 : 0.95}
                      style={{
                        transition: 'stroke 0.15s ease, stroke-width 0.15s ease',
                      }}
                    />

                    {/* AC Number */}
                    <text
                      x={item.cx}
                      y={item.cy - 7}
                      fill={item.textColor}
                      opacity={0.7}
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      #{item.acNo}
                    </text>

                    {/* AC Short Name */}
                    <text
                      x={item.cx}
                      y={item.cy + 2.5}
                      fill={item.textColor}
                      fontSize="7.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {shortName}
                    </text>

                    {/* Value Line: Party or Demographic % */}
                    <text
                      x={item.cx}
                      y={item.cy + 12}
                      fill={item.textColor}
                      fontSize="7"
                      fontWeight="800"
                      fontFamily={thematicLayer !== 'NONE' ? 'monospace' : 'sans-serif'}
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {thematicLayer !== 'NONE'
                        ? `${item.demographicPct}%`
                        : item.res?.winner.party || 'OTH'}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Hex Cartogram Floating Zoom Controls (Top Left) */}
          <div className="absolute top-3 left-3 z-[1000] flex flex-col rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white/95 backdrop-blur-md">
            <button
              type="button"
              onClick={handleHexZoomIn}
              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border-b border-slate-200 transition-colors cursor-pointer"
              title="Zoom In (+)"
              aria-label="Zoom in"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div
              className="text-[10px] font-mono font-bold text-slate-600 text-center py-1 select-none border-b border-slate-200 bg-slate-50/80"
              title="Current zoom level"
            >
              {Math.round(hexZoom * 100)}%
            </div>
            <button
              type="button"
              onClick={handleHexZoomOut}
              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom Out (-)"
              aria-label="Zoom out"
            >
              <Minus className="w-4 h-4" />
            </button>
            {(hexZoom !== 1 || hexPan.x !== 0 || hexPan.y !== 0) && (
              <button
                type="button"
                onClick={handleHexReset}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-t border-slate-200 transition-colors cursor-pointer"
                title="Reset Zoom & Pan (100%)"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Hex Cartogram Hovered AC HUD */}
          {hoveredItem && (
            <div className="absolute top-16 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-xl z-[1000] text-xs text-slate-800 space-y-1.5 min-w-[220px] pointer-events-none transition-all">
              <div className="font-bold border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span className="text-slate-900 flex items-center gap-1.5">
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] font-black">
                    #{hoveredItem.acNo}
                  </span>
                  <span>{hoveredItem.acName}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">{hoveredItem.district}</span>
              </div>
              <div className="flex items-center justify-between pt-0.5 text-[11px]">
                <span className="text-slate-500">Winner ({selectedYear}):</span>
                <span className="font-bold flex items-center gap-1" style={{ color: getPartyColor(hoveredItem.res?.winner.party || '') }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getPartyColor(hoveredItem.res?.winner.party || '') }} />
                  {hoveredItem.res?.winner.party} ({hoveredItem.res?.winner.candidate})
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Margin:</span>
                <span className="font-mono font-semibold text-slate-900">
                  +{hoveredItem.res?.margin.toLocaleString()} ({hoveredItem.res?.margin_pct}%)
                </span>
              </div>
              {thematicLayer !== 'NONE' && (
                <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-indigo-700 font-bold">
                  <span>{THEMATIC_LAYERS_META[thematicLayer].label}:</span>
                  <span className="font-mono bg-indigo-50 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded text-[11px] font-bold">
                    {hoveredItem.demographicPct}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Top Right: Unified Control Toolbar (Map vs Hex Mode + Quick Actions) */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
        {/* Representation Mode: Geographic Map vs Hex Cartogram Toggle */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-md flex items-center gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMapType('geographic')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              mapType === 'geographic'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map</span>
          </button>
          <button
            type="button"
            onClick={() => setMapType('hex_cartogram')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              mapType === 'hex_cartogram'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hexagon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Hex</span>
            <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded font-mono font-bold">
              175
            </span>
          </button>
        </div>

        {/* Quick Actions (Center, Layers, Fullscreen) */}
        <div className="flex items-center gap-1.5">
          {/* Hex mode: Color Palette toggle (Pastel vs Vibrant) */}
          {mapType === 'hex_cartogram' && (
            <button
              type="button"
              onClick={() => setHexColorMode((m) => (m === 'pastel' ? 'vibrant' : 'pastel'))}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                hexColorMode === 'pastel'
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 hover:bg-rose-900/80'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={`Color Scheme: currently ${hexColorMode === 'pastel' ? 'Pastel' : 'Vibrant'} (click to toggle)`}
            >
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline capitalize">{hexColorMode}</span>
            </button>
          )}

          {/* Hex mode: Reset View / Fit (when zoomed or panned) */}
          {mapType === 'hex_cartogram' && (hexZoom !== 1 || hexPan.x !== 0 || hexPan.y !== 0) && (
            <button
              type="button"
              onClick={handleHexReset}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
              title="Reset hex cartogram zoom & pan (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Re-center Button (Geographic mode only) */}
          {mapType === 'geographic' && (
            <button
              type="button"
              onClick={handleRecenter}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
              title="Re-center map on Andhra Pradesh"
            >
              <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Center</span>
            </button>
          )}

          {/* Floating Layers & Settings Menu (Geographic mode only) */}
          {mapType === 'geographic' && (
            <div
              ref={layersMenuRef}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLayersMenu((prev) => !prev);
                }}
                className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border shadow-md flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  showLayersMenu
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:text-white'
                }`}
                title="Map Overlays & Canvas"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Layers</span>
              </button>

              {/* Simple Small Popover Overlay */}
              {showLayersMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-2xl w-60 text-xs space-y-3.5 text-slate-800 animate-in fade-in zoom-in-95 duration-150 text-left">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Map Overlays</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLayersMenu(false)}
                      className="text-slate-400 hover:text-slate-700 text-xs font-bold p-0.5 rounded cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* District Boundaries & Labels */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      District Overlays (26 AP)
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowDistrictBorders(!showDistrictBorders)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          showDistrictBorders
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>Borders</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            showDistrictBorders ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowDistrictLabels(!showDistrictLabels)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          showDistrictLabels
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>Names</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            showDistrictLabels ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Basemap Selection */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Basemap Canvas
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleBasemapChange('light')}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs text-center transition-all cursor-pointer ${
                          basemap === 'light'
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Light Grayscale Canvas (CARTO Positron / Esri Light)"
                      >
                        Light Canvas
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBasemapChange('osm')}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs text-center transition-all cursor-pointer ${
                          basemap === 'osm'
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        title="OpenStreetMap Standard"
                      >
                        OSM
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Legend Overlay (Option A: Translucent glassmorphism, reveals on hover) */}
      <div className="absolute bottom-4 left-4 bg-white/75 hover:bg-white/98 opacity-60 hover:opacity-100 backdrop-blur-md p-3 rounded-xl shadow-xs hover:shadow-xl border border-slate-200/80 hover:border-slate-300 transition-all duration-300 z-[1000] text-xs group cursor-default select-none">
        {thematicLayer !== 'NONE' ? (
          <div className="space-y-1.5 min-w-[210px]">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span>{THEMATIC_LAYERS_META[thematicLayer].icon}</span>
              <span>{THEMATIC_LAYERS_META[thematicLayer].label} Density</span>
            </div>
            <p className="text-[10px] text-slate-500">{THEMATIC_LAYERS_META[thematicLayer].description}</p>
            <div className="grid grid-cols-6 gap-1 pt-1 text-[9px] text-center font-mono">
              <div>
                <div className="h-3 rounded-xs bg-[#f1f5f9] border border-slate-300" />
                <span className="text-slate-500">&lt;5%</span>
              </div>
              <div>
                <div className="h-3 rounded-xs bg-[#c7d2fe]" />
                <span className="text-slate-600">5-10%</span>
              </div>
              <div>
                <div className="h-3 rounded-xs bg-[#818cf8]" />
                <span className="text-slate-600">10-15%</span>
              </div>
              <div>
                <div className="h-3 rounded-xs bg-[#6366f1]" />
                <span className="text-slate-700">15-20%</span>
              </div>
              <div>
                <div className="h-3 rounded-xs bg-[#4f46e5]" />
                <span className="text-white bg-indigo-900 rounded-xs px-0.5">20-25%</span>
              </div>
              <div>
                <div className="h-3 rounded-xs bg-[#312e81]" />
                <span className="text-indigo-950 font-bold">&gt;25%</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              {viewMode === 'winner' && 'Party Legend'}
              {viewMode === 'margin' && 'Victory Margin'}
              {viewMode === 'swing' && 'Seat Swings & Holds'}
              {viewMode === 'district' && '26 Districts'}
            </div>

            {viewMode === 'district' && (
              <div className="space-y-1.5 max-w-[210px]">
                <p className="text-[11px] text-slate-600 leading-tight">
                  Constituencies mapped into Andhra Pradesh&apos;s <span className="font-bold text-slate-800">26 reorganized districts</span>, shaded in distinct tones of grey.
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="w-3.5 h-3.5 rounded-xs bg-[#e2e8f0] border border-slate-300" />
                  <span className="w-3.5 h-3.5 rounded-xs bg-[#cbd5e1] border border-slate-400" />
                  <span className="w-3.5 h-3.5 rounded-xs bg-[#94a3b8] border border-slate-500" />
                  <span className="w-3.5 h-3.5 rounded-xs bg-[#64748b] border border-slate-600" />
                  <span className="w-3.5 h-3.5 rounded-xs bg-[#475569] border border-slate-700" />
                  <span className="text-[10px] text-slate-500 font-medium ml-0.5">26 Shades</span>
                </div>
              </div>
            )}

            {viewMode === 'winner' && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {(() => {
                  const isPastel = mapType === 'hex_cartogram' && hexColorMode === 'pastel';
                  const parties = [
                    { code: 'TDP', label: 'TDP', solid: '#eab308' },
                    { code: 'YSRCP', label: 'YSRCP', solid: '#1d4ed8' },
                    { code: 'JSP', label: 'Janasena (JSP)', solid: '#dc2626' },
                    { code: 'BJP', label: 'BJP', solid: '#f97316' },
                    { code: 'INC', label: 'INC (Congress)', solid: '#0284c7' },
                    { code: 'OTH', label: 'IND / Others', solid: '#64748b' },
                  ];

                  return parties.map((p) => {
                    const pastel = getPastelPartyColor(p.code);
                    return (
                      <div key={p.code} className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-xs"
                          style={{
                            backgroundColor: isPastel ? pastel.fill : p.solid,
                            border: isPastel ? `1px solid ${pastel.stroke}` : undefined,
                          }}
                        />
                        <span className="font-medium">{p.label}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {viewMode === 'margin' && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#fef08a]" />
                  <span>&lt; 5% (Battleground)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#fed7aa]" />
                  <span>5% – 15% (Moderate)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#fb923c]" />
                  <span>15% – 25% (Comfortable)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#ea580c]" />
                  <span>&gt; 25% (Landslide)</span>
                </div>
              </div>
            )}

            {viewMode === 'swing' && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#64748b]" />
                  <span>Held by Incumbent Party</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#0284c7]" />
                  <span>Flipped / Gained (Party Color)</span>
                </div>
              </div>
            )}

            {/* Boundary Legend */}
            {showDistrictBorders && (
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-4 h-[2px] bg-slate-500 rounded-full" />
                  District Borders (Grey)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-4 h-[1.5px] bg-white border border-slate-300 rounded-full" />
                  AC Divider
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Right: Thematic Demographic Layer Selector (#7) */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-xl flex items-center gap-2 text-xs text-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline flex items-center gap-1">
            <span>👥</span> Demographics:
          </span>
          <select
            id="thematic-layer-select"
            name="thematicLayer"
            value={thematicLayer}
            onChange={(e) => setThematicLayer(e.target.value as ThematicLayerKey)}
            className="bg-slate-800 text-white font-medium rounded-lg px-2.5 py-1 text-xs border border-slate-700 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            {Object.entries(THEMATIC_LAYERS_META).map(([key, meta]) => (
              <option key={key} value={key} className="bg-slate-900 text-white">
                {meta.icon} {meta.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export const TelanganaMap = AndhraMap;
