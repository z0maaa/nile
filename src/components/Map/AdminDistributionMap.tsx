'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ApplicantApplication } from '@/lib/types';
import { TALENT_CATEGORIES } from '@/lib/translations';
import { MapPin, Filter, Layers, ExternalLink, Music, User } from 'lucide-react';

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

  // Filter only applicants who explicitly authorized and confirmed GPS
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
        // Center of Egypt: roughly 27.0, 30.8
        const map = L.map(mapContainerRef.current, {
          center: [27.5, 30.5],
          zoom: 6,
          zoomControl: true,
        });

        // Elegant Dark / Voyager Map Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;
      }

      // Re-populate markers whenever filteredApplicants changes
      if (markersLayerRef.current && mapInstanceRef.current) {
        markersLayerRef.current.clearLayers();

        const statusColorMap: Record<string, string> = {
          ACCEPTED: '#10B981', // Emerald
          SHORTLISTED: '#F59E0B', // Amber
          UNDER_REVIEW: '#3B82F6', // Blue
          NEW: '#D4AF37', // Gold
          REJECTED: '#EF4444', // Red
        };

        filteredApplicants.forEach((app) => {
          if (!app.coordinates) return;

          const color = statusColorMap[app.status] || '#D4AF37';
          const customMarker = L.divIcon({
            className: 'admin-geo-marker',
            html: `
              <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid #111; box-shadow: 0 0 12px ${color}; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 13px; cursor: pointer;">
                ♪
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -18],
          });

          const marker = L.marker([app.coordinates.latitude, app.coordinates.longitude], {
            icon: customMarker,
          });

          const popupHtml = `
            <div style="min-width: 220px; font-family: sans-serif; padding: 4px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <img src="${app.personalProfessionalPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid #D4AF37;" />
                <div>
                  <strong style="color: #fff; font-size: 13px; display: block;">${app.artistStageName || app.fullNameEnglish}</strong>
                  <span style="color: #D4AF37; font-size: 11px; font-weight: 600;">${app.referenceNumber}</span>
                </div>
              </div>
              <div style="font-size: 11px; color: #aaa; margin-bottom: 6px; line-height: 1.5;">
                <div>📍 <strong>${app.governorate}</strong> - ${app.city}</div>
                <div>🎵 <strong>${app.mainTalentCategory}</strong> (${app.musicalGenre})</div>
                <div>🏷️ Status: <strong style="color: ${color};">${app.status}</strong></div>
              </div>
              <a href="/admin/applicants/${app.id}" style="display: block; text-align: center; background: #D4AF37; color: #000; font-weight: bold; font-size: 11px; padding: 6px 10px; border-radius: 6px; text-decoration: none; margin-top: 8px;">
                Open Full Dossier →
              </a>
            </div>
          `;

          marker.bindPopup(popupHtml);
          markersLayerRef.current.addLayer(marker);
        });

        // Fit bounds if markers exist
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

  // Governorate aggregation
  const govCounts: Record<string, number> = {};
  filteredApplicants.forEach((a) => {
    govCounts[a.governorate] = (govCounts[a.governorate] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Control Filter Bar */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold">
            <Filter className="w-3.5 h-3.5 text-gold-400" />
            <span>Filters:</span>
          </div>

          {/* Talent Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-gold-500"
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
            className="px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-gold-500"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              groupByGov
                ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
                : 'bg-surface border-white/10 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Group by Governorate</span>
          </button>
        </div>

        {/* Counter Summary */}
        <div className="text-xs text-zinc-400">
          Showing <strong className="text-gold-400">{filteredApplicants.length}</strong> verified GPS pins of{' '}
          <span className="text-zinc-300">{applicants.length} total applicants</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Interactive Map */}
        <div className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative ${groupByGov ? 'lg:col-span-3 h-[600px]' : 'lg:col-span-4 h-[650px]'}`}>
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Governorate Breakdown Sidebar */}
        {groupByGov && (
          <div className="lg:col-span-1 p-4 rounded-2xl glass-card border border-white/10 space-y-4 max-h-[600px] overflow-y-auto">
            <h4 className="text-white font-bold text-sm flex items-center justify-between pb-2 border-b border-white/10">
              <span>Governorates Hub</span>
              <span className="text-xs text-gold-400">{Object.keys(govCounts).length} regions</span>
            </h4>

            <div className="space-y-2">
              {Object.entries(govCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([gov, count]) => (
                  <div
                    key={gov}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-white/5 text-xs hover:border-gold-500/30 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gold-400" />
                      <span className="font-semibold text-zinc-200">{gov}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold">
                      {count} {count === 1 ? 'applicant' : 'applicants'}
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

