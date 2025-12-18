"use client";
import { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "@/lib/maps";
import { Trip } from "@/lib/firestore";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (trip: Omit<Trip, "id" | "createdAt">) => void;
  ownerUid: string;
};

export default function TripCreationModal({ open, onClose, onCreate, ownerUid }: Props) {
  const { isLoaded } = useGoogleMaps();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dates, setDates] = useState({ start: "", end: "" });
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);

  if (!open) return null;

  const center = pin || { lat: 37.7749, lng: -122.4194 };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-lg p-4 space-y-3">
        <h2 className="text-xl font-semibold">Create Trip</h2>
        <div className="grid grid-cols-1 gap-2">
          <input className="border p-2 rounded" placeholder="Trip name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="border p-2 rounded" type="date" value={dates.start} onChange={(e) => setDates({ ...dates, start: e.target.value })} />
            <input className="border p-2 rounded" type="date" value={dates.end} onChange={(e) => setDates({ ...dates, end: e.target.value })} />
          </div>
          <input className="border p-2 rounded" placeholder="Location address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div className="h-64 border rounded overflow-hidden">
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
          <button className="px-3 py-2 rounded border" onClick={onClose}>Cancel</button>
          <button
            className="px-3 py-2 rounded bg-blue-600 text-white"
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
