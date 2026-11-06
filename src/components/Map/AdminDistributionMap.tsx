'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ApplicantApplication } from '@/lib/types';
import { TALENT_CATEGORIES } from '@/lib/translations';
import { MapPin, Filter, Layers } from 'lucide-react';

interface AdminDistributionMapProps {
  applicants: ApplicantApplication[];
}

export default function AdminDistributionMap({ applicants }: AdminDistributionMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [groupByGov, setGroupByGov] = useState<boolean>(false);

  const validGpsApplicants = applicants.filter(
    (a) => a.locationSharingAuthorized && a.coordinates && a.coordinates.latitude && a.coordinates.longitude
  );

  const filteredApplicants = validGpsApplicants.filter((a) => {
    if (selectedCategory !== 'ALL' && a.mainTalentCategory !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && a.status !== selectedStatus) return false;
    return true;
  });

  useEffect(() => {
    let isMounted = true;

    async function initAdminMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [27.5, 30.5],
          zoom: 6,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;
      }

      if (markersLayerRef.current && mapInstanceRef.current) {
        markersLayerRef.current.clearLayers();

        const statusColorMap: Record<string, string> = {
          ACCEPTED: '#059669', // Emerald
          SHORTLISTED: '#D97706', // Amber
          UNDER_REVIEW: '#2563EB', // Blue
          NEW: '#0A192F', // Navy
          REJECTED: '#DC2626', // Red
        };

        filteredApplicants.forEach((app) => {
          if (!app.coordinates) return;

          const color = statusColorMap[app.status] || '#059669';
          const customMarker = L.divIcon({
            className: 'admin-geo-marker',
            html: `
              <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(10,25,47,0.3); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 14px; cursor: pointer;">
                ♪
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -18],
          });

          const marker = L.marker([app.coordinates.latitude, app.coordinates.longitude], {
            icon: customMarker,
          });

          const popupHtml = `
            <div style="min-width: 230px; font-family: sans-serif; padding: 4px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <img src="${app.personalProfessionalPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid #059669;" />
                <div>
                  <strong style="color: #0A192F; font-size: 13px; display: block;">${app.artistStageName || app.fullNameEnglish}</strong>
                  <span style="color: #059669; font-size: 11px; font-weight: bold;">${app.referenceNumber}</span>
                </div>
              </div>
              <div style="font-size: 11px; color: #475569; margin-bottom: 6px; line-height: 1.5;">
                <div>📍 <strong>${app.governorate}</strong> - ${app.city}</div>
                <div>🎵 <strong>${app.mainTalentCategory}</strong> (${app.musicalGenre})</div>
                <div>🏷️ Status: <strong style="color: ${color};">${app.status}</strong></div>
              </div>
              <a href="/admin/applicants/${app.id}" style="display: block; text-align: center; background: #0A192F; color: #ffffff; font-weight: bold; font-size: 11px; padding: 7px 10px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
                Open Full Dossier →
              </a>
            </div>
          `;

          marker.bindPopup(popupHtml);
          markersLayerRef.current.addLayer(marker);
        });

        if (filteredApplicants.length > 0) {
          const latLngs = filteredApplicants.map((a) => [a.coordinates!.latitude, a.coordinates!.longitude]);
          mapInstanceRef.current.fitBounds(latLngs, { padding: [50, 50], maxZoom: 12 });
        }
      }
    }

    initAdminMap();

    return () => {
      isMounted = false;
    };
  }, [filteredApplicants]);

  const govCounts: Record<string, number> = {};
  filteredApplicants.forEach((a) => {
    govCounts[a.governorate] = (govCounts[a.governorate] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Control Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filters:</span>
          </div>

          {/* Talent Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium outline-none"
          >
            <option value="ALL">All Categories ({validGpsApplicants.length})</option>
            {TALENT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.en}>
                {c.en}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="SHORTLISTED">SHORTLISTED</option>
            <option value="ACCEPTED">ACCEPTED (Top 10)</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          {/* Toggle Grouping sidebar */}
          <button
            onClick={() => setGroupByGov(!groupByGov)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              groupByGov
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-navy-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Group by Governorate</span>
          </button>
        </div>

        {/* Counter Summary */}
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-emerald-700">{filteredApplicants.length}</strong> verified GPS pins of{' '}
          <span className="text-slate-800 font-bold">{applicants.length} total applicants</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Interactive Map */}
        <div className={`rounded-2xl overflow-hidden border border-slate-200 shadow-md relative bg-white ${groupByGov ? 'lg:col-span-3 h-[600px]' : 'lg:col-span-4 h-[650px]'}`}>
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Governorate Breakdown Sidebar */}
        {groupByGov && (
          <div className="lg:col-span-1 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 max-h-[600px] overflow-y-auto">
            <h4 className="text-navy-900 font-bold text-sm flex items-center justify-between pb-2 border-b border-slate-100">
              <span>Governorates Hub</span>
              <span className="text-xs text-emerald-700 font-bold">{Object.keys(govCounts).length} regions</span>
            </h4>

            <div className="space-y-2">
              {Object.entries(govCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([gov, count]) => (
                  <div
                    key={gov}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:border-emerald-300 transition-all font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-slate-700">{gov}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
