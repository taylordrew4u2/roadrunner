"use client";
import { useEffect, useState } from "react";
import LaunchScreen from "@/components/LaunchScreen";
import TripCreationModal from "@/components/TripCreationModal";
import { auth, onAuthReady } from "@/lib/firebase";
import { createTrip, subscribeTrips, Trip } from "@/lib/firestore";
import Link from "next/link";
import { checkAppPassword } from "@/lib/auth";

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [gateOpen, setGateOpen] = useState<boolean>(false);
  const [gateInput, setGateInput] = useState("");

  useEffect(() => {
    onAuthReady().then((u) => setUid(u)).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeTrips(uid, setTrips);
    return () => unsub();
  }, [uid]);

  if (!ready) return <LaunchScreen />;

  if (!gateOpen) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-white border rounded p-4 w-80 space-y-2">
          <h1 className="text-lg font-semibold">Enter App Password</h1>
          <input className="border p-2 rounded w-full" type="password" value={gateInput} onChange={(e) => setGateInput(e.target.value)} />
          <button
            className="px-3 py-2 rounded bg-blue-600 text-white w-full"
            onClick={async () => {
              if (await checkAppPassword(gateInput)) setGateOpen(true);
              else alert("Incorrect password");
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Trips</h1>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">User: {auth.currentUser?.uid}</div>
          <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={() => setShowCreate(true)}>Add Trip</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {trips.map((t) => (
          <Link key={t.id} href={`/trip/${t.id}`}
            className="block p-3 border rounded bg-white hover:bg-gray-50">
            <div className="font-semibold">{t.name}</div>
            {t.location?.address && <div className="text-sm text-gray-600">{t.location.address}</div>}
            <div className="text-sm text-gray-600">{t.startDate} → {t.endDate}</div>
          </Link>
        ))}
      </div>

      {showCreate && (
        <TripCreationModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          ownerUid={uid!}
          onCreate={async (trip) => {
            const id = await createTrip(trip);
            setShowCreate(false);
            window.location.href = `/trip/${id}`;
          }}
        />
      )}
    </div>
  );
}
