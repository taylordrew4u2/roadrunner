"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useGoogleMaps } from "@/lib/maps";

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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-semibold">Pick Location</h2>
        <input className="border p-2 rounded w-full" placeholder="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} />
        <div className="h-80 border rounded overflow-hidden">
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
          <button className="px-3 py-2 rounded border" onClick={onClose}>Cancel</button>
          <button
            className="px-3 py-2 rounded bg-blue-600 text-white"
            onClick={() => {
              if (!pin) return;
              onPick({ ...pin, address });
              onClose();
            }}
          >
            Use Location
          </button>
        </div>
      </div>
    </div>
  );
}
