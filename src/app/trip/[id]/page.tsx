"use client";
import { useEffect, useMemo, useState, ReactNode } from "react";
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

  const tabs: { key: typeof tab; label: string; icon: ReactNode }[] = [
    { key: "itinerary", label: "Itinerary", icon: <CalendarDays size={16} /> },
    { key: "maps", label: "Maps", icon: <MapPin size={16} /> },
    { key: "tickets", label: "Tickets", icon: <Ticket size={16} /> },
    { key: "notes", label: "Notes", icon: <StickyNote size={16} /> },
    { key: "todo", label: "To-Do", icon: <CheckSquare size={16} /> },
    { key: "members", label: "Members", icon: <Users size={16} /> },
  ];

  if (!trip) return <div className="p-4">Loading trip...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/70 via-white/40 to-emerald-50/60 dark:from-brand-900/20 dark:via-white/5 dark:to-emerald-900/10" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-soft">Trip</span>
              {trip.location?.address && <span className="badge-soft inline-flex items-center gap-2"><MapPin size={14} /> {trip.location.address}</span>}
            </div>
            <h1 className="text-3xl font-bold leading-tight">{trip.name}</h1>
            <div className="text-sm text-gray-700 dark:text-gray-200 flex flex-wrap gap-2 items-center">
              <span className="badge-soft">{trip.startDate} → {trip.endDate}</span>
              <span className="badge-soft">Members: {members.length}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <ThemeToggle />
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (!auth.currentUser?.uid) {
                  alert("Not authenticated");
                  return;
                }
                const token = await createInvite(tripId, auth.currentUser.uid);
                const link = `${window.location.origin}/invite/${token}`;
                await navigator.clipboard.writeText(link);
                alert("Invite link copied!");
              }}
            >
              <LinkIcon size={16} />
              Share invite
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} className={tab === t.key ? "pill-active" : "pill"} onClick={() => setTab(t.key)}>
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
