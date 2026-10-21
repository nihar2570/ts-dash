import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import {
  RotateCcw,
  Target,
  X,
  Layers,
  Users,
  Compass,
  FileText,
} from 'lucide-react';
import type { BoothDetail } from './BoothPannaDeficitSolver';
import { getPartyColor } from '../types';

export interface BoothTriageMapProps {
  acNo: number;
  acName: string;
  district: string;
  targetParty: string;
  booths: BoothDetail[];
  geoJsonData?: any;
  selectedTriageCategory?: 'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all' | null;
  onSelectTriageCategory?: (cat: 'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all') => void;
  selectedBoothNo?: number | null;
  onSelectBooth?: (booth: BoothDetail | null) => void;
  onViewVoterRoll?: (booth: BoothDetail) => void;
  onOpenStandaloneBooth?: (booth: BoothDetail) => void;
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
  isFullPageMap?: boolean;
}

export const BoothTriageMap: React.FC<BoothTriageMapProps> = ({
  acNo,
  targetParty,
  booths,
  geoJsonData,
  selectedBoothNo,
  onSelectBooth,
  onViewVoterRoll,
  onOpenStandaloneBooth,
  theme: controlledTheme,
  isFullPageMap = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const mandalLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const beaconLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersByBoothRef = useRef<Map<number, L.CircleMarker>>(new Map());

  const isLight = controlledTheme === 'light';

  // Mandal lines overlay visibility toggle
  const [showMandalLines, setShowMandalLines] = useState<boolean>(true);

  // Active / Clicked Booth for detail inspection drawer
  const [activeBooth, setActiveBooth] = useState<BoothDetail | null>(null);

  // Sync with selectedBoothNo prop if passed
  useEffect(() => {
    if (selectedBoothNo) {
      const match = booths.find((b) => b.boothNo === selectedBoothNo);
      if (match) setActiveBooth(match);
    }
  }, [selectedBoothNo, booths]);

  // Extract AC polygon feature from geoJsonData
  const acFeature = useMemo(() => {
    if (!geoJsonData || !geoJsonData.features) return null;
    return (
      geoJsonData.features.find((f: any) => {
        const props = f.properties || {};
        const pAcNo = props.AC_NO ?? props.ac_no ?? props.ac ?? props.ID;
        return Number(pAcNo) === Number(acNo);
      }) || null
    );
  }, [geoJsonData, acNo]);

  // Group booths by Mandal to compute mandal centroids and boundaries
  const mandalGroups = useMemo(() => {
    const map = new Map<string, { latSum: number; lngSum: number; count: number }>();
    booths.forEach((b) => {
      const entry = map.get(b.mandalName) || { latSum: 0, lngSum: 0, count: 0 };
      entry.latSum += b.lat;
      entry.lngSum += b.lng;
      entry.count += 1;
      map.set(b.mandalName, entry);
    });

    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      centerLat: data.count > 0 ? data.latSum / data.count : 0,
      centerLng: data.count > 0 ? data.lngSum / data.count : 0,
    }));
  }, [booths]);

  // Compute Mandal Sectors by Voronoi clipping against the constituency boundary
  const mandalGeoJson = useMemo(() => {
    if (!acFeature || mandalGroups.length < 2) return null;
    try {
      const acBbox = turf.bbox(acFeature) as [number, number, number, number];
      const dx = (acBbox[2] - acBbox[0]) * 0.2;
      const dy = (acBbox[3] - acBbox[1]) * 0.2;
      const expandedBbox: [number, number, number, number] = [
        acBbox[0] - dx,
        acBbox[1] - dy,
        acBbox[2] + dx,
        acBbox[3] + dy,
      ];

      const points = turf.featureCollection(
        mandalGroups.map((m, idx) =>
          turf.point([m.centerLng, m.centerLat], { mandalName: m.name, idx, boothCount: m.count })
        )
      );

      const voronoi = turf.voronoi(points, { bbox: expandedBbox });
      const sectors: any[] = [];

      voronoi.features.forEach((cell, i) => {
        if (!cell) return;
        const mandal = mandalGroups[i];
        try {
          const inter = turf.intersect(turf.featureCollection([acFeature, cell]));
          if (inter) {
            inter.properties = {
              mandalName: mandal?.name || `Mandal ${i + 1}`,
              boothCount: mandal?.count || 0,
              centerLat: mandal?.centerLat || 0,
              centerLng: mandal?.centerLng || 0,
            };
            sectors.push(inter);
          }
        } catch {
          // ignore intersection edge cases
        }
      });

      if (sectors.length > 0) {
        return turf.featureCollection(sectors);
      }
    } catch (e) {
      console.warn('Could not generate mandal sectors for map:', e);
    }
    return null;
  }, [acFeature, mandalGroups]);

  // Helper color function
  const getTriageColor = (triage: string) => {
    switch (triage) {
      case 'battleground':
        return '#f59e0b'; // Amber / Orange
      case 'fortress':
        return '#10b981'; // Emerald Green
      case 'vulnerable':
        return '#eab308'; // Golden Yellow
      case 'hostile':
        return '#f43f5e'; // Rose / Red
      default:
        return '#6366f1';
    }
  };

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mandalLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    beaconLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Basemap tile layer management (CARTO Dark Matter vs CARTO Positron)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    const cartoKey = import.meta.env.VITE_CARTO_API_KEY;
    const style = isLight ? 'light_all' : 'dark_all';
    const tileUrl = cartoKey
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/${style}/{z}/{x}/{y}{r}.png?key=${cartoKey}`
      : `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`;

    const layer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    });

    layer.addTo(map);
    tileLayerRef.current = layer;
  }, [isLight]);

  // Handle map resizing when in full page mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullPageMap]);

  // 3. Render AC Polygon Boundary & Fit Bounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }

    if (acFeature) {
      const boundaryLayer = L.geoJSON(acFeature, {
        style: () => ({
          color: isLight ? '#4338ca' : '#818cf8',
          weight: isLight ? 2.8 : 2.5,
          opacity: 0.95,
          fillColor: isLight ? '#6366f1' : '#312e81',
          fillOpacity: isLight ? 0.08 : 0.12,
          dashArray: '5, 5',
        }),
        interactive: false,
      }).addTo(map);

      boundaryLayerRef.current = boundaryLayer;

      try {
        const bounds = boundaryLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [35, 35] });
        }
      } catch {
        // Fallback
      }
    } else if (booths.length > 0) {
      const lats = booths.map((b) => b.lat).filter((lat) => !isNaN(lat) && lat !== 0);
      const lngs = booths.map((b) => b.lng).filter((lng) => !isNaN(lng) && lng !== 0);
      if (lats.length > 0 && lngs.length > 0) {
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        map.fitBounds(
          [
            [minLat, minLng],
            [maxLat, maxLng],
          ],
          { padding: [35, 35] }
        );
      }
    }
  }, [acFeature, booths, isLight]);

  // 4. Render Mandal Boundary Lines & Sector Labels within the AC
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = mandalLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!showMandalLines || !mandalGeoJson) return;

    const sectorLayer = L.geoJSON(mandalGeoJson, {
      style: () => ({
        color: isLight ? '#0284c7' : '#38bdf8', // Vibrant sky-blue boundary line
        weight: isLight ? 1.8 : 1.5,
        opacity: 0.85,
        dashArray: '6, 6',
        fillColor: isLight ? '#0284c7' : '#0ea5e9',
        fillOpacity: isLight ? 0.04 : 0.03,
      }),
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {};
        layer.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px; font-weight: 700; color: ${isLight ? '#0f172a' : '#f8fafc'};">
            📍 ${props.mandalName} Mandal
            <div style="font-size: 10px; font-weight: 500; color: ${isLight ? '#475569' : '#94a3b8'};">
              ${props.boothCount} polling stations
            </div>
          </div>`,
          {
            className: isLight ? 'booth-tooltip-light' : 'booth-tooltip-dark',
            direction: 'center',
            sticky: true,
            opacity: 0.98,
          }
        );
      },
    });

    group.addLayer(sectorLayer);

    // Place subtle floating badges for Mandal sector centers
    mandalGroups.forEach((m) => {
      if (m.centerLat && m.centerLng) {
        const labelIcon = L.divIcon({
          className: 'mandal-label-pill',
          html: `<div style="
            display: inline-block;
            padding: 2px 8px;
            font-size: 10px;
            font-weight: 700;
            border-radius: 9999px;
            white-space: nowrap;
            background: ${isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,0.92)'};
            color: ${isLight ? '#0369a1' : '#7dd3fc'};
            border: 1px solid ${isLight ? '#7dd3fc' : 'rgba(56,189,248,0.45)'};
            box-shadow: 0 2px 5px rgba(0,0,0,0.18);
            pointer-events: none;
          ">📍 ${m.name}</div>`,
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        });
        const labelMarker = L.marker([m.centerLat, m.centerLng], {
          icon: labelIcon,
          interactive: false,
          pane: 'overlayPane',
        });
        group.addLayer(labelMarker);
      }
    });
  }, [showMandalLines, mandalGeoJson, mandalGroups, isLight]);

  // 5. Render Polling Station Circle Markers with High-Contrast Theme Tooltips
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    markersByBoothRef.current.clear();

    booths.forEach((b) => {
      if (isNaN(b.lat) || isNaN(b.lng) || (b.lat === 0 && b.lng === 0)) return;

      const isSelected = activeBooth?.boothNo === b.boothNo;
      const isBattleground = b.triage === 'battleground';
      const color = getTriageColor(b.triage);

      const marker = L.circleMarker([b.lat, b.lng], {
        radius: isSelected ? 9.5 : isBattleground ? 7 : 5.5,
        fillColor: color,
        color: isSelected
          ? (isLight ? '#1e1b4b' : '#ffffff')
          : isBattleground
          ? (isLight ? '#b45309' : '#fef3c7')
          : (isLight ? '#ffffff' : '#0f172a'),
        weight: isSelected ? 3 : isBattleground ? 1.8 : 1,
        fillOpacity: isSelected ? 1 : isLight ? 0.95 : 0.88,
        pane: isBattleground || isSelected ? 'markerPane' : 'overlayPane',
      });

      // High-Contrast Tooltip with clean visibility in Light and Dark themes
      const leadSign = b.margin > 0 ? `+${b.margin}` : `${b.margin}`;
      const titleColor = isLight ? '#0f172a' : '#ffffff';
      const locColor = isLight ? '#475569' : '#94a3b8';
      const voteColor = isLight ? '#0f172a' : '#f1f5f9';
      const borderDivColor = isLight ? '#e2e8f0' : '#334155';

      const tooltipContent = `
        <div style="font-family: inherit; font-size: 11px; line-height: 1.4;">
          <div style="font-weight: 800; font-size: 12px; color: ${titleColor};">
            PS #${b.boothNo} &middot; ${b.name}
          </div>
          <div style="color: ${locColor}; font-size: 10px; margin-top: 2px;">
            📍 ${b.location} &middot; <strong style="color: ${titleColor};">${b.mandalName} Mandal</strong>
          </div>
          <div style="margin-top: 5px; display: flex; align-items: center; justify-content: space-between; gap: 8px; border-top: 1px solid ${borderDivColor}; padding-top: 4px;">
            <span style="font-weight: 700; color: ${color}; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em;">
              ${b.triage}
            </span>
            <span style="font-family: monospace; font-weight: 700; color: ${voteColor};">
              ${targetParty} ${leadSign} votes
            </span>
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        className: isLight ? 'booth-tooltip-light' : 'booth-tooltip-dark',
        direction: 'top',
        offset: [0, -6],
        opacity: 0.98,
      });

      marker.on('click', () => {
        setActiveBooth(b);
        if (onSelectBooth) onSelectBooth(b);
      });

      markersByBoothRef.current.set(b.boothNo, marker);
      marker.addTo(markersGroup);
    });
  }, [booths, activeBooth, targetParty, onSelectBooth, isLight]);

  // 6. Smooth Camera Fly-To & Pulsing Beacon Reticle for Active / Located Booth
  useEffect(() => {
    const map = mapInstanceRef.current;
    const beaconGroup = beaconLayerGroupRef.current;
    if (!map || !beaconGroup) return;

    beaconGroup.clearLayers();

    if (!activeBooth || isNaN(activeBooth.lat) || isNaN(activeBooth.lng) || activeBooth.lat === 0) {
      return;
    }

    // Refresh map bounds in case container just transitioned from list view to map
    map.invalidateSize();

    // Smoothly fly camera directly to the booth coordinates with high zoom level (zoom 15)
    const currentZoom = map.getZoom();
    const targetZoom = Math.max(currentZoom, 15);
    map.flyTo([activeBooth.lat, activeBooth.lng], targetZoom, {
      animate: true,
      duration: 1.2,
      easeLinearity: 0.25,
    });

    // Add High-Visibility Animated Pulsing Radar Beacon
    const color = getTriageColor(activeBooth.triage);
    const beaconHtml = `
      <div style="position: relative; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
        <div style="
          position: absolute;
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          background: ${color};
          opacity: 0.55;
          animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: absolute;
          width: 34px;
          height: 34px;
          border-radius: 9999px;
          border: 2.5px solid ${color};
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 16px ${color};
          animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3.5px solid ${color};
          box-shadow: 0 2px 10px rgba(0,0,0,0.6);
        "></div>
      </div>
    `;

    const beaconIcon = L.divIcon({
      className: 'booth-radar-beacon',
      html: beaconHtml,
      iconSize: [56, 56],
      iconAnchor: [28, 28],
    });

    const beaconMarker = L.marker([activeBooth.lat, activeBooth.lng], {
      icon: beaconIcon,
      interactive: false,
      pane: 'markerPane',
      zIndexOffset: 2500,
    });

    beaconGroup.addLayer(beaconMarker);

    // Auto-open tooltip on the target booth marker once fly-to arrives
    const timer = setTimeout(() => {
      const marker = markersByBoothRef.current.get(activeBooth.boothNo);
      if (marker && map) {
        marker.openTooltip();
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [activeBooth]);

  // Center / Reset View handler
  const handleResetBounds = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (boundaryLayerRef.current) {
      map.fitBounds(boundaryLayerRef.current.getBounds(), { padding: [35, 35] });
    }
  };

  const targetColor = getPartyColor(targetParty);

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border transition-colors shadow-inner ${
        isLight ? 'border-slate-300 bg-slate-100' : 'border-slate-800 bg-slate-950'
      } ${isFullPageMap ? 'flex-1 flex flex-col min-h-0 h-full' : ''}`}
    >
      {/* Map Canvas */}
      <div className={`relative w-full ${isFullPageMap ? 'flex-1 min-h-[450px] h-full' : 'h-[480px] sm:h-[540px]'} ${isLight ? 'bg-slate-100' : 'bg-slate-950'}`}>
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Top Center: Active Focused Booth Banner */}
        {activeBooth && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-amber-500/70 backdrop-blur-md animate-in fade-in slide-in-from-top-2 pointer-events-auto max-w-[90%] sm:max-w-md">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-amber-300 font-mono font-bold shrink-0">PS #{activeBooth.boothNo}</span>
            <span className="truncate">{activeBooth.name}</span>
            <button
              type="button"
              onClick={handleResetBounds}
              className="ml-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-200 hover:text-white transition-colors cursor-pointer border border-slate-700 shrink-0 font-mono font-bold"
              title="Reset zoom to view all constituency polling stations"
            >
              Fit AC
            </button>
          </div>
        )}

        {/* Top-Right Floating Controls (Mandals toggle & Reset bounds) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 pointer-events-auto">
          {/* Mandal Lines Toggle */}
          <button
            type="button"
            onClick={() => setShowMandalLines(!showMandalLines)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md backdrop-blur-md border ${
              showMandalLines
                ? isLight
                  ? 'bg-sky-100/95 text-sky-800 border-sky-300'
                  : 'bg-sky-950/90 text-sky-300 border-sky-500/50'
                : isLight
                ? 'bg-white/90 text-slate-500 border-slate-300 hover:text-slate-800'
                : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle Mandal Sector Boundary Lines & Labels"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Mandal Lines</span>
          </button>

          {/* Reset Bounds */}
          <button
            type="button"
            onClick={handleResetBounds}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-md backdrop-blur-md ${
              isLight
                ? 'bg-white/90 hover:bg-slate-100 text-slate-600 border-slate-300'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Reset Map View / Fit Bounds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Left Legend */}
        <div
          className={`absolute bottom-3 left-3 z-20 backdrop-blur-md p-2.5 rounded-xl border text-[11px] space-y-1.5 shadow-xl pointer-events-auto transition-colors ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-800 shadow-md'
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          <div
            className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3 h-3 text-indigo-500" />
            <span>Triage Legend (Target: {targetParty})</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
              <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Fortress (&gt;60%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-xs" />
              <span className="text-amber-500 font-bold">Battleground (&le;45)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-xs" />
              <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Vulnerable (1-40)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
              <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Hostile (&gt;60%)</span>
            </div>
          </div>
          {showMandalLines && (
            <div
              className={`pt-1 border-t text-[10px] flex items-center gap-1.5 ${
                isLight ? 'border-slate-200 text-sky-700' : 'border-slate-800 text-sky-300'
              }`}
            >
              <span className="w-3 border-b-2 border-dashed border-sky-400" />
              <span>Mandal Sector Boundaries</span>
            </div>
          )}
        </div>

        {/* Selected Booth Inspector Card (Sliding overlay) */}
        {activeBooth && (
          <div
            className={`absolute top-12 right-3 left-3 sm:left-auto sm:w-96 z-30 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150 transition-colors ${
              isLight
                ? 'bg-white/95 border-indigo-300 text-slate-900 shadow-indigo-100'
                : 'bg-slate-900/95 border-indigo-500/50 text-white'
            }`}
          >
            <div
              className={`flex items-start justify-between gap-2 border-b pb-2 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                      isLight
                        ? 'bg-slate-100 text-amber-700 border-slate-300'
                        : 'bg-slate-800 text-amber-300 border-slate-700'
                    }`}
                  >
                    PS #{activeBooth.boothNo}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      activeBooth.triage === 'battleground'
                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                        : activeBooth.triage === 'fortress'
                        ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                        : activeBooth.triage === 'vulnerable'
                        ? 'bg-yellow-400/20 text-yellow-600 border-yellow-400/40'
                        : 'bg-rose-500/20 text-rose-600 border-rose-500/40'
                    }`}
                  >
                    {activeBooth.triage === 'battleground'
                      ? '🔥 Battleground (≤45 votes)'
                      : activeBooth.triage === 'fortress'
                      ? '🏰 Fortress'
                      : activeBooth.triage === 'vulnerable'
                      ? '⚠️ Vulnerable'
                      : '🛑 Hostile'}
                  </span>
                </div>
                <h4
                  className={`text-xs sm:text-sm font-bold mt-1 leading-snug ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {activeBooth.name}
                </h4>
                <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  📍 {activeBooth.location} &middot;{' '}
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {activeBooth.mandalName} Mandal
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveBooth(null)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div
              className={`grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-950/80 border-slate-800 text-slate-200'
              }`}
            >
              <div>
                <span
                  className={`text-[10px] block uppercase ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  Registered Electors
                </span>
                <span
                  className={`font-mono font-bold flex items-center gap-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  <Users className="w-3 h-3 text-indigo-500" />
                  {activeBooth.electorate} (~{activeBooth.pannaPages} pages)
                </span>
              </div>
              <div>
                <span
                  className={`text-[10px] block uppercase ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  Voter Turnout
                </span>
                <span
                  className={`font-mono font-bold ${
                    isLight ? 'text-indigo-600' : 'text-indigo-300'
                  }`}
                >
                  {activeBooth.turnoutPct}% polled
                </span>
              </div>
              <div>
                <span
                  className={`text-[10px] block uppercase ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  Form-20 Votes
                </span>
                <span className="font-mono">
                  <strong style={{ color: targetColor }}>
                    {targetParty}: {activeBooth.targetVotes}
                  </strong>{' '}
                  vs {activeBooth.opponentVotes}
                </span>
              </div>
              <div>
                <span
                  className={`text-[10px] block uppercase ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  Target Margin
                </span>
                <span
                  className={`font-mono font-bold ${
                    activeBooth.margin > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {activeBooth.margin > 0 ? `+${activeBooth.margin} lead` : `${activeBooth.margin} deficit`}
                </span>
              </div>
            </div>

            {/* Panna Pramukh Directive */}
            <div
              className={`text-[11px] p-2 rounded-lg border flex items-start gap-1.5 ${
                isLight
                  ? 'bg-amber-50/80 border-amber-200 text-slate-800'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Ground Directive:</strong> {activeBooth.actionNote}
              </span>
            </div>

            {/* View in Dedicated Standalone E-Panna & Rolls Tab */}
            <button
              type="button"
              onClick={() => {
                if (onOpenStandaloneBooth) {
                  onOpenStandaloneBooth(activeBooth);
                } else {
                  const url = new URL(window.location.origin + window.location.pathname);
                  url.searchParams.set('tab', 'booth-data');
                  url.searchParams.set('ac', String(acNo));
                  url.searchParams.set('booth', String(activeBooth.boothNo));
                  window.open(url.toString(), '_blank');
                }
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white group"
              title="Open full E-Panna, voter register, and household caste intelligence in dedicated standalone tab"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-200 group-hover:scale-110 transition-transform" />
              <span>Open in E-Panna &amp; Rolls Standalone Tab ({activeBooth.electorate} Electors) ↗</span>
            </button>

            {/* Optional Quick Overlay Modal */}
            {onViewVoterRoll && (
              <button
                type="button"
                onClick={() => onViewVoterRoll(activeBooth)}
                className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all border flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                }`}
                title="Quick preview modal"
              >
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Quick Preview Modal</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
