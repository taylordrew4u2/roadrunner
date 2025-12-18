"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useGoogleMaps } from "@/lib/maps";
import { X, Check } from "lucide-react";

const GoogleMap = dynamic(() => import("@react-google-maps/api").then(m => ({ default: m.GoogleMap })), { ssr: false });
const Marker = dynamic(() => import("@react-google-maps/api").then(m => ({ default: m.Marker })), { ssr: false });

type Location = { lat: number; lng: number; address?: string };

export default function LocationPickerModal({
  open,
  onClose,
  onPick,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (loc: Location) => void;
  initial?: Location | null;
}) {
  const { isLoaded } = useGoogleMaps();
  const [pin, setPin] = useState<Location | null>(initial || null);
  const [address, setAddress] = useState<string>(initial?.address || "");

  if (!open) return null;
  const center = pin || { lat: 37.7749, lng: -122.4194 };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="pickLocationTitle">
      <div className="card w-full max-w-3xl p-6 space-y-4">
        <h2 id="pickLocationTitle" className="text-lg font-semibold">Pick Location</h2>
        <input className="input w-full" placeholder="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} />
        <div className="h-80 border rounded-xl overflow-hidden bg-white/60">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center as any}
              zoom={pin ? 12 : 3}
              onClick={(e) => {
                if (!e.latLng) return;
                setPin({ lat: e.latLng.lat(), lng: e.latLng.lng(), address });
              }}
            >
              {pin && <Marker position={pin as any} />}
            </GoogleMap>
          ) : (
            <div className="flex h-full items-center justify-center">Loading map…</div>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button className="btn btn-outline" onClick={onClose}>
            <X size={16} />
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!pin) return;
              onPick({ ...pin, address });
              onClose();
            }}
          >
            <Check size={16} />
            Use Location
          </button>
        </div>
      </div>
    </div>
  );
}
