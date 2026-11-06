'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/Admin/AdminNav';
import AdminDistributionMap from '@/components/Map/AdminDistributionMap';
import { ApplicantApplication } from '@/lib/types';
import { MapPin, ShieldCheck, Info } from 'lucide-react';

export default function AdminMapPage() {
  const [applicants, setApplicants] = useState<ApplicantApplication[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
        }

        const res = await fetch('/api/applications');
        if (res.ok) {
          const data = await res.json();
          setApplicants(data.applications || []);
        }
      } catch (err) {
        console.error('Error fetching applications for map:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminNav currentUser={currentUser} />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient p-[1px]">
                <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-gold-400" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Applicants Geographic Distribution
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Interactive GIS mapping of voluntary GPS-confirmed applicants across Egypt.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-gold-950/20 border border-gold-500/20 text-xs text-gold-300">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <span>Strictly Verified Device GPS Coordinates Only (No IP Estimation)</span>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-3 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs text-zinc-400">Loading interactive mapping points...</span>
          </div>
        ) : (
          <AdminDistributionMap applicants={applicants} />
        )}
      </main>
    </div>
  );
}

