"use client";
import { useEffect, useMemo, useState } from "react";
import { addEvent, ItineraryEvent, subscribeEvents } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const LocationPickerModal = dynamic(() => import("@/components/LocationPickerModal"), { ssr: false });

type Props = { tripId: string; startDate: string; endDate: string };

function listDays(start: string, end: string): string[] {
  const s = new Date(start);
  const e = new Date(end);
  const out: string[] = [];
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    out.push(new Date(d).toISOString().slice(0, 10));
  }
  return out;
}

export default function ItineraryTab({ tripId, startDate, endDate }: Props) {
  const [events, setEvents] = useState<ItineraryEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<{ title: string; time: string; notes: string; location: { lat: number; lng: number; address?: string } | null }>({ title: "", time: "12:00", notes: "", location: null });
  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    const unsub = subscribeEvents(tripId, setEvents);
    return () => unsub();
  }, [tripId]);

  const days = useMemo(() => listDays(startDate, endDate), [startDate, endDate]);
  const eventsByDay = useMemo(() => {
    const m: Record<string, ItineraryEvent[]> = {};
    for (const ev of events) {
      m[ev.day] = m[ev.day] || [];
      m[ev.day].push(ev);
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => a.time.localeCompare(b.time));
    return m;
  }, [events]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {days.map((d) => (
          <button
            key={d}
            className={`card p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${selectedDay === d ? "ring-2 ring-brand-300" : ""}`}
            onClick={() => setSelectedDay(d)}
          >
            <div className="font-semibold text-sm text-brand-700 dark:text-brand-200">Day {days.indexOf(d) + 1}</div>
            <div className="font-medium">{new Date(d).toDateString()}</div>
            <div className="text-xs text-gray-500">{eventsByDay[d]?.length || 0} events</div>
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="card p-4">
          <h3 className="font-semibold text-lg">Timeline for {new Date(selectedDay).toDateString()}</h3>
          <div className="space-y-4 mt-4 relative">
            <div className="absolute left-9 top-0 bottom-0 border-l border-dashed border-brand-200 dark:border-brand-800" aria-hidden />
            {(eventsByDay[selectedDay] || []).map((ev) => (
              <div key={ev.id} className="flex items-start gap-3 relative">
                <div className="w-16 text-right font-mono text-sm text-gray-600">{ev.time}</div>
                <div className="relative flex-1 p-4 bg-white/80 rounded-xl border border-white/60 dark:bg-white/5 dark:border-white/10 shadow-soft">
                  <div className="absolute -left-10 top-4 w-4 h-4 rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 shadow-soft" aria-hidden />
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{ev.title}</div>
                  {ev.location?.address && <div className="text-sm text-gray-600 dark:text-gray-300">{ev.location.address}</div>}
                  {ev.notes && <div className="text-sm text-gray-600 dark:text-gray-300">{ev.notes}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input className="input" placeholder="Event title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
              <input className="input" type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
              <input className="input" placeholder="Notes" value={newEvent.notes} onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })} />
              <button className="btn btn-outline" onClick={() => setShowLocation(true)}>
                <MapPin size={16} />
                {newEvent.location ? "Change Location" : "Pick Location"}
              </button>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (!selectedDay || !newEvent.title) return;
                  await addEvent(tripId, {
                    tripId,
                    day: selectedDay,
                    title: newEvent.title,
                    notes: newEvent.notes,
                    time: newEvent.time,
                    location: newEvent.location,
                    createdBy: auth.currentUser?.uid || "",
                  });
                  setNewEvent({ title: "", time: "12:00", notes: "", location: null });
                }}
              >
                Add Event
              </button>
            </div>
            {showLocation && (
              <LocationPickerModal
                open={showLocation}
                onClose={() => setShowLocation(false)}
                onPick={(loc) => setNewEvent((e) => ({ ...e, location: loc }))}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
