'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/Admin/AdminNav';
import AdminDistributionMap from '@/components/Map/AdminDistributionMap';
import { ApplicantApplication } from '@/lib/types';
import { MapPin, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <AdminNav currentUser={currentUser} />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-900 to-emerald-600 p-[1px] shadow-sm">
                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
                Applicants Geographic Distribution
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Interactive GIS mapping of voluntary GPS-confirmed applicants across Egypt.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Strictly Verified Device GPS Coordinates Only (No IP Estimation)</span>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs text-slate-500 font-medium">Loading interactive mapping points...</span>
          </div>
        ) : (
          <AdminDistributionMap applicants={applicants} />
        )}
      </main>
    </div>
  );
}
