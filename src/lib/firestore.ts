import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export type Trip = {
  id?: string;
  name: string;
  location: { lat: number; lng: number; address: string } | null;
  startDate: string; // ISO date
  endDate: string; // ISO date
  notificationEnabled: boolean;
  ownerUid: string;
  createdAt?: any;
};

export type TripMember = {
  uid: string;
  phone?: string;
  role?: "owner" | "member";
  displayName?: string;
  joinedAt?: any;
};

export type ItineraryEvent = {
  id?: string;
  tripId: string;
  day: string; // ISO date for the day
  title: string;
  notes?: string;
  time: string; // HH:mm
  location?: { lat: number; lng: number; address?: string } | null;
  createdBy: string;
  createdAt?: any;
};

export type Task = {
  id?: string;
  title: string;
  notes?: string;
  dueAt?: string; // ISO date/time
  createdBy: string;
  createdAt?: any;
};

export async function createTrip(trip: Trip) {
  const col = collection(db, "trips");
  const ref = await addDoc(col, {
    ...trip,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeTrip(tripId: string, cb: (trip: Trip | null) => void) {
  const ref = doc(db, "trips", tripId);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return cb(null);
    cb({ id: snap.id, ...(snap.data() as Trip) });
  });
}

export function subscribeTrips(uid: string, cb: (docs: Trip[]) => void) {
  const col = collection(db, "trips");
  const q = query(col, where("ownerUid", "==", uid));
  return onSnapshot(q, (snap) => {
    const out: Trip[] = [];
    snap.forEach((d) => out.push({ id: d.id, ...(d.data() as Trip) }));
    cb(out);
  });
}

export function subscribeTripMembers(tripId: string, cb: (members: TripMember[]) => void) {
  const col = collection(db, "trips", tripId, "members");
  return onSnapshot(col, (snap) => {
    const out: TripMember[] = [];
    snap.forEach((d) => out.push(d.data() as TripMember));
    cb(out);
  });
}

export async function addMember(tripId: string, member: TripMember) {
  const ref = doc(db, "trips", tripId, "members", member.uid);
  await setDoc(ref, { ...member, joinedAt: serverTimestamp() });
}

export function subscribeEvents(tripId: string, cb: (events: ItineraryEvent[]) => void) {
  const col = collection(db, "trips", tripId, "events");
  return onSnapshot(col, (snap) => {
    const out: ItineraryEvent[] = [];
    snap.forEach((d) => out.push({ id: d.id, ...(d.data() as ItineraryEvent) }));
    cb(out);
  });
}

export async function addEvent(tripId: string, event: ItineraryEvent) {
  const col = collection(db, "trips", tripId, "events");
  await addDoc(col, { ...event, createdAt: serverTimestamp() });
}

export function subscribeTasks(tripId: string, cb: (tasks: Task[]) => void) {
  const col = collection(db, "trips", tripId, "tasks");
  return onSnapshot(col, (snap) => {
    const out: Task[] = [];
    snap.forEach((d) => out.push({ id: d.id, ...(d.data() as Task) }));
    cb(out);
  });
}

export async function addTask(tripId: string, task: Task) {
  const col = collection(db, "trips", tripId, "tasks");
  await addDoc(col, { ...task, createdAt: serverTimestamp() });
}

export async function toggleTaskCheck(tripId: string, taskId: string, uid: string, checked: boolean) {
  const ref = doc(db, "trips", tripId, "tasks", taskId, "checks", uid);
  if (checked) {
    await setDoc(ref, { checkedAt: serverTimestamp(), uid });
  } else {
    await deleteDoc(ref);
  }
}

export function subscribeTaskChecks(tripId: string, taskId: string, cb: (uids: string[]) => void) {
  const col = collection(db, "trips", tripId, "tasks", taskId, "checks");
  return onSnapshot(col, (snap) => {
    const out: string[] = [];
    snap.forEach((d) => out.push(d.id));
    cb(out);
  });
}

export async function upsertNotes(tripId: string, content: string, uid: string) {
  const ref = doc(db, "trips", tripId, "notes", "main");
  await setDoc(ref, { content, updatedBy: uid, updatedAt: serverTimestamp() }, { merge: true });
}

export function subscribeNotes(tripId: string, cb: (content: string) => void) {
  const ref = doc(db, "trips", tripId, "notes", "main");
  return onSnapshot(ref, (snap) => {
    cb((snap.data()?.content as string) || "");
  });
}

// Invites
export type Invite = {
  token: string;
  tripId: string;
  createdBy: string;
  createdAt?: any;
};

export async function createInvite(tripId: string, createdBy: string) {
  const token = uuidv4();
  const ref = doc(db, "invites", token);
  await setDoc(ref, { token, tripId, createdBy, createdAt: serverTimestamp() });
  return token;
}

export async function getInvite(token: string): Promise<string | null> {
  const ref = doc(db, "invites", token);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data().tripId;
}

export function subscribeInvite(token: string, cb: (invite: Invite | null) => void) {
  const ref = doc(db, "invites", token);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return cb(null);
    cb(snap.data() as Invite);
  });
}
