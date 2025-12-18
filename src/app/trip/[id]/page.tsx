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
import ThemeToggle from "@/components/ThemeToggle";
import { CalendarDays, MapPin, Ticket, StickyNote, CheckSquare, Users, Link as LinkIcon } from "lucide-react";

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

  const tabs: { key: typeof tab; label: string; icon: JSX.Element }[] = [
    { key: "itinerary", label: "Itinerary", icon: <CalendarDays size={16} /> },
    { key: "maps", label: "Maps", icon: <MapPin size={16} /> },
    { key: "tickets", label: "Tickets", icon: <Ticket size={16} /> },
    { key: "notes", label: "Notes", icon: <StickyNote size={16} /> },
    { key: "todo", label: "To-Do", icon: <CheckSquare size={16} /> },
    { key: "members", label: "Members", icon: <Users size={16} /> },
  ];

  if (!trip) return <div className="p-4">Loading trip...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{trip.name}</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="btn bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={async () => {
            const token = await createInvite(tripId);
            const link = `${window.location.origin}/invite/${token}`;
            await navigator.clipboard.writeText(link);
            alert("Invite link copied!");
          }}
          >
            <LinkIcon size={16} />
            Invite
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} className={tab === t.key ? "pill-active" : "pill bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"} onClick={() => setTab(t.key)}>
            {t.icon}
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
