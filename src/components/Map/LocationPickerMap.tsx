'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Navigation, CheckCircle2, AlertTriangle, Crosshair } from 'lucide-react';

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  isAuthorized: boolean;
  onLocationChange: (data: {
    authorized: boolean;
    latitude?: number;
    longitude?: number;
    addressLabel?: string;
  }) => void;
}

export default function LocationPickerMap({
  initialLat = 30.0444, // Default Cairo
  initialLng = 31.2357,
  isAuthorized,
  onLocationChange,
}: LocationPickerProps) {
  const { t, isRtl } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [authorized, setAuthorized] = useState<boolean>(isAuthorized);
  const [loadingGps, setLoadingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: authorized ? 13 : 6,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 19,
        }).addTo(map);

        const emeraldIcon = L.divIcon({
          className: 'custom-emerald-marker',
          html: `<div style="background-color: #059669; width: 30px; height: 30px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(5,150,105,0.5); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 14px;">♪</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([lat, lng], {
          draggable: true,
          icon: emeraldIcon,
        }).addTo(map);

        marker.on('dragend', (e: any) => {
          const position = e.target.getLatLng();
          if (isMounted) {
            setLat(Number(position.lat.toFixed(5)));
            setLng(Number(position.lng.toFixed(5)));
            onLocationChange({
              authorized: true,
              latitude: Number(position.lat.toFixed(5)),
              longitude: Number(position.lng.toFixed(5)),
              addressLabel: addressLabel || 'Custom pin location',
            });
          }
        });

        markerRef.current = marker;
        mapInstanceRef.current = map;
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.setView([lat, lng], 14, { animate: true });
    }
  }, [lat, lng]);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(isRtl ? 'خاصية تحديد الموقع غير مدعومة في متصفحك' : 'Geolocation is not supported by your browser');
      return;
    }

    setLoadingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = Number(pos.coords.latitude.toFixed(5));
        const longitude = Number(pos.coords.longitude.toFixed(5));
        const label = `GPS Verified (${latitude}, ${longitude})`;

        setLat(latitude);
        setLng(longitude);
        setAuthorized(true);
        setAddressLabel(label);
        setLoadingGps(false);

        onLocationChange({
          authorized: true,
          latitude,
          longitude,
          addressLabel: label,
        });
      },
      (err) => {
        setLoadingGps(false);
        console.warn('Geolocation denied or unavailable:', err);
        let msg = isRtl
          ? 'تعذر الوصول للإحداثيات (ربما تم رفض الإذن من المتصفح). يمكنك تحديد موقعك يدوياً عبر سحب الدبوس.'
          : 'Could not obtain GPS permission. You can still pinpoint your location manually by dragging the pin on the map.';
        if (err.code === 1) {
          msg = isRtl ? 'تم رفض إذن مشاركة الموقع من قِبل المستخدم.' : 'Location permission was denied in browser settings.';
        }
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  const handleDeclineLocation = () => {
    setAuthorized(false);
    onLocationChange({
      authorized: false,
      latitude: undefined,
      longitude: undefined,
      addressLabel: undefined,
    });
  };

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
      {/* Explanation Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs leading-relaxed text-emerald-950">
        <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-emerald-900 font-bold mb-1 text-sm">{t.form.gpsTitle}</strong>
          <p className="text-emerald-800">{t.form.gpsExplanation}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRequestLocation}
          disabled={loadingGps}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-navy-900 to-emerald-600 hover:from-navy-950 hover:to-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {loadingGps ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>{loadingGps ? t.form.gpsFetching : t.form.gpsShareBtn}</span>
        </button>

        {authorized && (
          <button
            type="button"
            onClick={handleDeclineLocation}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all"
          >
            {t.form.gpsDeclineBtn}
          </button>
        )}
      </div>

      {gpsError && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{gpsError}</span>
        </div>
      )}

      {authorized && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white border border-emerald-300 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.form.gpsConfirmed}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-700 font-mono text-[11px]">
              <span>
                {t.form.gpsLat}: <strong className="text-navy-900">{lat}</strong>
              </span>
              <span>
                {t.form.gpsLng}: <strong className="text-navy-900">{lng}</strong>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.form.gpsPinNotice}</span>
          </p>

          {/* Interactive Leaflet Map Container */}
          <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>
      )}

      {!authorized && (
        <p className="text-[11px] text-slate-500 italic">
          {t.form.gpsDeclineNotice}
        </p>
      )}
    </div>
  );
}
