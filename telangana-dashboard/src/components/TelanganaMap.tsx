import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Key, ExternalLink } from 'lucide-react';
import type { ConstituencyResult, Year, ViewMode } from '../types';
import { getPartyColor, getDistrictGrey } from '../types';

interface MapProps {
  geoJsonData: any;
  districtGeoJsonData?: any;
  yearResults: Record<string, ConstituencyResult>;
  selectedAcNo: number | null;
  onSelectAc: (acNo: number) => void;
  viewMode: ViewMode;
  selectedYear: Year;
}

export const TelanganaMap: React.FC<MapProps> = ({
  geoJsonData,
  districtGeoJsonData,
  yearResults,
  selectedAcNo,
  onSelectAc,
  viewMode,
  selectedYear,
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

  // Basemap & Carto API key management
  const cleanApiKey = (key: string) => (key || '').replace(/^['"]|['"]$/g, '').trim();
  const envKey = (import.meta as any).env?.VITE_CARTO_API_KEY || '';
  const [cartoKey, setCartoKey] = useState<string>(() => {
    return cleanApiKey(localStorage.getItem('telangana_carto_key') || envKey);
  });
  const [basemap, setBasemap] = useState<'light' | 'osm' | 'carto'>(() => {
    const saved = localStorage.getItem('telangana_basemap') as 'light' | 'osm' | 'carto' | null;
    const initialKey = cleanApiKey(localStorage.getItem('telangana_carto_key') || envKey);
    if (saved && (saved !== 'carto' || initialKey)) {
      return saved;
    }
    // If a CARTO key is configured, select CARTO; otherwise use watermark-free Light Canvas
    return initialKey ? 'carto' : 'light';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputKey, setInputKey] = useState(cartoKey);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Telangana roughly [17.87, 79.05]
    const map = L.map(mapContainerRef.current, {
      center: [17.87, 79.05],
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

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Update Tile Layer when basemap or cartoKey changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    let layer: L.TileLayer;

    if (basemap === 'light') {
      // Esri World Light Gray Base: Clean, minimal canvas with zero watermark and no API key required
      layer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 16,
          attribution: 'Tiles &copy; Esri',
        }
      );
    } else if (basemap === 'osm') {
      layer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }
      );
    } else {
      // CARTO Positron - append key parameter to remove watermark
      const trimmedKey = cleanApiKey(cartoKey);
      const url = trimmedKey
        ? `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(trimmedKey)}`
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      layer = L.tileLayer(url, {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution: '&copy; CARTO',
      });
    }

    layer.addTo(map);
    tileLayerRef.current = layer;
  }, [mapReady, basemap, cartoKey]);

  const handleBasemapChange = (type: 'light' | 'osm' | 'carto') => {
    setBasemap(type);
    localStorage.setItem('telangana_basemap', type);
    if (type === 'carto' && !cleanApiKey(cartoKey)) {
      setShowKeyModal(true);
    }
  };

  const handleSaveCartoKey = (key: string) => {
    const trimmed = cleanApiKey(key);
    setCartoKey(trimmed);
    if (trimmed) {
      localStorage.setItem('telangana_carto_key', trimmed);
      setBasemap('carto');
      localStorage.setItem('telangana_basemap', 'carto');
    } else {
      localStorage.removeItem('telangana_carto_key');
      if (basemap === 'carto') {
        setBasemap('light');
        localStorage.setItem('telangana_basemap', 'light');
      }
    }
    setShowKeyModal(false);
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

      if (isSelected) {
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

    // Fit bounds initially
    if (!hasFittedBoundsRef.current && geoJsonData.features && geoJsonData.features.length > 0) {
      map.fitBounds(layer.getBounds(), { padding: [15, 15] });
      hasFittedBoundsRef.current = true;
    }
  }, [mapReady, geoJsonData, yearResults, selectedAcNo, viewMode, selectedYear, onSelectAc]);

  return (
    <div className="relative w-full h-full min-h-[580px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '580px' }} />

      {/* Basemap Switcher & District Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* District Grouping Toggles */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm p-1 flex items-center gap-1 text-xs text-slate-700">
            <button
              type="button"
              onClick={() => setShowDistrictBorders(!showDistrictBorders)}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 text-xs font-semibold ${
                showDistrictBorders
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Toggle distinct district boundary lines"
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  showDistrictBorders ? 'bg-indigo-400' : 'bg-slate-300'
                }`}
              />
              District Borders
            </button>
            <button
              type="button"
              onClick={() => setShowDistrictLabels(!showDistrictLabels)}
              className={`px-2 py-1 rounded-md transition-all text-xs ${
                showDistrictLabels
                  ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle district name labels"
            >
              Names
            </button>
          </div>

          {/* Basemap Selector */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm p-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => handleBasemapChange('light')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                basemap === 'light'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Clean light canvas (No API key required, zero watermark)"
            >
              Light Canvas
            </button>
            <button
              type="button"
              onClick={() => handleBasemapChange('osm')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                basemap === 'osm'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="OpenStreetMap standard tiles (Free, no watermark)"
            >
              OSM
            </button>
            <button
              type="button"
              onClick={() => handleBasemapChange('carto')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                basemap === 'carto'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="CARTO Positron (Requires free API key)"
            >
              CARTO
              {cartoKey.trim() ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="API Key configured" />
              ) : (
                <span title="Key needed to avoid watermark" className="inline-flex items-center">
                  <Key className="w-3 h-3 text-amber-500" />
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setInputKey(cartoKey);
                setShowKeyModal(!showKeyModal);
              }}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-all"
              title="Configure CARTO API Key"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARTO Key Popover / Modal */}
        {showKeyModal && (
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xl w-72 text-xs space-y-2.5 text-left">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                CARTO Basemap API Key
              </span>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              CARTO now imprints watermarks on basemap tiles unless a free API key is provided.
            </p>
            <a
              href="https://carto.com/basemaps/apikey/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Get free key at carto.com/basemaps/apikey
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="space-y-1.5 pt-1">
              <input
                type="text"
                placeholder="Paste CARTO API key here..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2 justify-end">
                {cartoKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputKey('');
                      handleSaveCartoKey('');
                    }}
                    className="px-2.5 py-1 text-slate-500 hover:text-rose-600 font-medium text-xs"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSaveCartoKey(inputKey)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs text-xs"
                >
                  Save Key
                </button>
              </div>
            </div>
            <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
              Tip: Switch to <span className="font-semibold text-slate-600">Light Canvas</span> for watermark-free maps without any API key.
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-slate-200 z-[1000] text-xs">
        <div className="font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
          {viewMode === 'winner' && 'Party Legend'}
          {viewMode === 'margin' && 'Victory Margin'}
          {viewMode === 'swing' && 'Seat Status'}
          {viewMode === 'district' && '33 Districts'}
        </div>

        {viewMode === 'district' && (
          <div className="space-y-1.5 max-w-[210px]">
            <p className="text-[11px] text-slate-600 leading-tight">
              Constituencies mapped into Telangana&apos;s <span className="font-bold text-slate-800">33 official districts</span>, shaded in distinct tones of grey.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#e2e8f0] border border-slate-300" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#cbd5e1] border border-slate-400" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#94a3b8] border border-slate-500" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#64748b] border border-slate-600" />
              <span className="w-3.5 h-3.5 rounded-xs bg-[#475569] border border-slate-700" />
              <span className="text-[10px] text-slate-500 font-medium ml-0.5">33 Shades</span>
            </div>
          </div>
        )}

        {viewMode === 'winner' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#0284c7]" />
              <span className="font-medium">INC (Congress)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#ec4899]" />
              <span className="font-medium">BRS / TRS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#f97316]" />
              <span className="font-medium">BJP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#15803d]" />
              <span className="font-medium">AIMIM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#eab308]" />
              <span className="font-medium">TDP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#dc2626]" />
              <span className="font-medium">Left (CPI/CPM)</span>
            </div>
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
      </div>
    </div>
  );
};
