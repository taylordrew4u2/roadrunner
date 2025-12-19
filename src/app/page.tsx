"use client";
import { useEffect, useState } from "react";
import LaunchScreen from "@/components/LaunchScreen";
import TripCreationModal from "@/components/TripCreationModal";
import { auth, onAuthReady } from "@/lib/firebase";
import { createTrip, subscribeTrips, Trip } from "@/lib/firestore";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Plus } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-base">
        <div className="card w-full max-w-md space-y-4 p-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-600">Roadrunner</p>
            <h1 className="text-2xl font-bold">Enter the workspace</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Protected access keeps your shared itineraries private.</p>
          </div>
          <div className="space-y-3">
            <input className="input w-full" placeholder="App password" type="password" value={gateInput} onChange={(e) => setGateInput(e.target.value)} />
            <button
              className="btn btn-primary w-full"
              onClick={async () => {
                if (await checkAppPassword(gateInput)) setGateOpen(true);
                else alert("Incorrect password");
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="card p-6 border border-white/50 bg-white/70 dark:bg-white/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-600">Roadrunner</p>
            <h1 className="text-3xl font-bold leading-tight">Plan together, travel beautifully.</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">Create trips, sync timelines, and keep everyone aligned with maps, tickets, notes, and tasks in one elegant workspace.</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge-soft">Realtime sync</span>
              <span className="badge-soft">Google Maps</span>
              <span className="badge-soft">Shared tasks</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="text-xs text-gray-600 dark:text-gray-300">Signed in as</div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 text-sm border border-white/50 dark:border-white/10">{auth.currentUser?.uid}</div>
              <ThemeToggle />
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={16} />
              Create a trip
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trips.map((t) => (
          <Link
            key={t.id}
            href={`/trip/${t.id}`}
            className="block card p-5 hover:shadow-xl hover:-translate-y-1 transition relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50/70 to-emerald-50/60 dark:from-brand-900/10 dark:to-emerald-900/5 opacity-0 group-hover:opacity-100 transition"></div>
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <span className="badge-soft">{t.startDate} → {t.endDate}</span>
              </div>
              {t.location?.address && <div className="text-sm text-gray-600 dark:text-gray-300">{t.location.address}</div>}
            </div>
          </Link>
        ))}
        {trips.length === 0 && (
          <div className="card p-5 text-center text-gray-600 dark:text-gray-300">
            No trips yet. Start by creating your first shared itinerary.
          </div>
        )}
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
