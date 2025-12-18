"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ItineraryEvent, subscribeEvents, subscribeTripMembers, TripMember, subscribeTrip, Trip, createInvite } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import ItineraryTab from "@/components/tabs/ItineraryTab";
import MapsTab from "@/components/tabs/MapsTab";
import TicketsTab from "@/components/tabs/TicketsTab";
import NotesTab from "@/components/tabs/NotesTab";
import ToDoTab from "@/components/tabs/ToDoTab";
import MembersTab from "@/components/tabs/MembersTab";

export default function TripPage() {
  const params = useParams<{ id: string }>();
  const tripId = params.id;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [events, setEvents] = useState<ItineraryEvent[]>([]);
  const [members, setMembers] = useState<TripMember[]>([]);
  const [tab, setTab] = useState<"itinerary" | "maps" | "tickets" | "notes" | "todo" | "members">("itinerary");

  useEffect(() => {
    const u1 = subscribeEvents(tripId, setEvents);
    const u2 = subscribeTripMembers(tripId, setMembers);
    const u3 = subscribeTrip(tripId, setTrip);
    return () => { u1(); u2(); u3(); };
  }, [tripId]);

  const tabs: { key: typeof tab; label: string }[] = [
    { key: "itinerary", label: "Itinerary" },
    { key: "maps", label: "Maps" },
    { key: "tickets", label: "Tickets" },
    { key: "notes", label: "Notes" },
    { key: "todo", label: "To-Do" },
    { key: "members", label: "Members" },
  ];

  if (!trip) return <div className="p-4">Loading trip...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{trip.name}</h1>
        <button
          className="px-3 py-2 rounded bg-green-600 text-white"
          onClick={async () => {
            const token = await createInvite(tripId);
            const link = `${window.location.origin}/invite/${token}`;
            await navigator.clipboard.writeText(link);
            alert("Invite link copied!");
          }}
        >
          🔗 Invite
        </button>
      </div>
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t.key} className={`px-3 py-2 rounded border ${tab === t.key ? "bg-blue-600 text-white border-blue-600" : "bg-white"}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "itinerary" && <ItineraryTab tripId={tripId} startDate={trip.startDate} endDate={trip.endDate} />}
      {tab === "maps" && <MapsTab events={events} />}
      {tab === "tickets" && <TicketsTab tripId={tripId} />}
      {tab === "notes" && <NotesTab tripId={tripId} />}
      {tab === "todo" && <ToDoTab tripId={tripId} members={members} />}
      {tab === "members" && <MembersTab tripId={tripId} />}
    </div>
  );
}
