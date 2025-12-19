"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useGoogleMaps } from "@/lib/maps";
import { Trip } from "@/lib/firestore";
import { X, Check } from "lucide-react";

const GoogleMap = dynamic(() => import("@react-google-maps/api").then(m => ({ default: m.GoogleMap })), { ssr: false });
const Marker = dynamic(() => import("@react-google-maps/api").then(m => ({ default: m.Marker })), { ssr: false });

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (trip: Omit<Trip, "id" | "createdAt">) => void;
  ownerUid: string;
};

export default function TripCreationModal({ open, onClose, onCreate, ownerUid }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  const { isLoaded } = useGoogleMaps();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dates, setDates] = useState({ start: "", end: "" });
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);

  if (!open) return null;

  const center = pin || { lat: 37.7749, lng: -122.4194 };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="createTripTitle">
      <div className="card w-full max-w-2xl p-6 space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/70 via-white/40 to-emerald-50/60 dark:from-brand-900/20 dark:via-white/5 dark:to-emerald-900/10" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-600">New itinerary</p>
            <h2 id="createTripTitle" className="text-2xl font-bold">Create Trip</h2>
          </div>
          <button className="btn btn-outline" onClick={onClose}>
            <X size={16} />
            Close
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <input className="input" placeholder="Trip name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" type="date" value={dates.start} onChange={(e) => setDates({ ...dates, start: e.target.value })} />
            <input className="input" type="date" value={dates.end} onChange={(e) => setDates({ ...dates, end: e.target.value })} />
          </div>
          <input className="input" placeholder="Location address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div className="h-64 border rounded-2xl overflow-hidden bg-white/70 dark:bg-white/10 shadow-soft relative">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={pin ? 12 : 3}
              onClick={(e) => {
                if (!e.latLng) return;
                setPin({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              }}
            >
              {pin && <Marker position={pin} />}
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
              if (!name || !dates.start || !dates.end) return;
              onCreate({
                name,
                location: pin ? { ...pin, address } : null,
                startDate: dates.start,
                endDate: dates.end,
                notificationEnabled: true,
                ownerUid,
              });
              onClose();
            }}
          >
            <Check size={16} />
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
