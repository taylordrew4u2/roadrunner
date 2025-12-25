import { apiClient, getCurrentUserId } from "@/lib/firebase";

export type Trip = {
  id?: string;
  name: string;
  location: { lat: number; lng: number; address: string } | null;
  startDate: string;
  endDate: string;
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
  day: string;
  title: string;
  notes?: string;
  time: string;
  location?: { lat: number; lng: number; address?: string } | null;
  createdBy: string;
  createdAt?: any;
};

export type Task = {
  id?: string;
  title: string;
  notes?: string;
  dueAt?: string;
  createdBy: string;
  createdAt?: any;
  checkedBy?: string[];
};

export async function createTrip(trip: Trip) {
  const result = await apiClient.request("/api/trips", {
    method: "POST",
    body: JSON.stringify(trip),
  });
  return result.id;
}

export function subscribeTrip(tripId: string, cb: (trip: Trip | null) => void) {
  apiClient
    .request(`/api/trips/${tripId}`)
    .then((trip) => cb(trip))
    .catch(() => cb(null));

  // Poll for updates
  const interval = setInterval(() => {
    apiClient
      .request(`/api/trips/${tripId}`)
      .then((trip) => cb(trip))
      .catch(() => cb(null));
  }, 2000);

  return () => clearInterval(interval);
}

export function subscribeTrips(uid: string, cb: (docs: Trip[]) => void) {
  apiClient
    .request("/api/trips")
    .then((trips) => cb(trips))
    .catch(() => cb([]));

  // Poll for updates
  const interval = setInterval(() => {
    apiClient
      .request("/api/trips")
      .then((trips) => cb(trips))
      .catch(() => cb([]));
  }, 2000);

  return () => clearInterval(interval);
}

export function subscribeTripMembers(tripId: string, cb: (members: TripMember[]) => void) {
  apiClient
    .request(`/api/trips/${tripId}/members`)
    .then((members) => cb(members))
    .catch(() => cb([]));

  // Poll for updates
  const interval = setInterval(() => {
    apiClient
      .request(`/api/trips/${tripId}/members`)
      .then((members) => cb(members))
      .catch(() => cb([]));
  }, 2000);

  return () => clearInterval(interval);
}

export async function addMember(tripId: string, member: TripMember) {
  await apiClient.request(`/api/trips/${tripId}/members`, {
    method: "POST",
    body: JSON.stringify(member),
  });
}

export function subscribeEvents(tripId: string, cb: (events: ItineraryEvent[]) => void) {
  apiClient
    .request(`/api/trips/${tripId}/events`)
    .then((events) => cb(events))
    .catch(() => cb([]));

  // Poll for updates
  const interval = setInterval(() => {
    apiClient
      .request(`/api/trips/${tripId}/events`)
      .then((events) => cb(events))
      .catch(() => cb([]));
  }, 2000);

  return () => clearInterval(interval);
}

export async function addEvent(tripId: string, event: ItineraryEvent) {
  await apiClient.request(`/api/trips/${tripId}/events`, {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export function subscribeTasks(tripId: string, cb: (tasks: Task[]) => void) {
  apiClient
    .request(`/api/trips/${tripId}/tasks`)
    .then((tasks) => cb(tasks))
    .catch(() => cb([]));

  // Poll for updates
  const interval = setInterval(() => {
    apiClient
      .request(`/api/trips/${tripId}/tasks`)
      .then((tasks) => cb(tasks))
      .catch(() => cb([]));
  }, 2000);

  return () => clearInterval(interval);
}

export async function addTask(tripId: string, task: Task) {
  await apiClient.request(`/api/trips/${tripId}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export async function toggleTaskCheck(tripId: string, taskId: string, uid: string, checked: boolean) {
  await apiClient.request(`/api/trips/${tripId}/tasks/${taskId}/check`, {
    method: "PATCH",
    body: JSON.stringify({ checked }),
  });
}

export function subscribeTaskChecks(tripId: string, taskId: string, cb: (uids: string[]) => void) {
  apiClient
    .request(`/api/trips/${tripId}/tasks`)
    .then((tasks) => {
      const task = tasks.find((t) => t.id === taskId);
      cb(task?.checkedBy || []);
    })
    .catch(() => cb([]));

  // Poll for updates
  const interval = setInterval(() => {
    apiClient
      .request(`/api/trips/${tripId}/tasks`)
      .then((tasks) => {
        const task = tasks.find((t) => t.id === taskId);
        cb(task?.checkedBy || []);
      })
      .catch(() => cb([]));
  }, 2000);

  return () => clearInterval(interval);
}

export async function upsertNotes(tripId: string, content: string, uid: string) {
  await apiClient.request(`/api/trips/${tripId}/notes`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export function subscribeNotes(tripId: string, cb: (content: string) => void) {
  apiClient
    .request(`/api/trips/${tripId}/notes`)
    .then((data) => cb(data.content || ""))
    .catch(() => cb(""));

  // Poll for updates
  const interval = setInterval(() => {
    apiClient
      .request(`/api/trips/${tripId}/notes`)
      .then((data) => cb(data.content || ""))
      .catch(() => cb(""));
  }, 2000);

  return () => clearInterval(interval);
}

// Invites
export type Invite = {
  token: string;
  tripId: string;
  createdBy: string;
  createdAt?: any;
};

export async function createInvite(tripId: string, createdBy: string) {
  const result = await apiClient.request(`/api/trips/${tripId}/invites`, {
    method: "POST",
  });
  return result.token;
}

export async function getInvite(token: string): Promise<string | null> {
  try {
    const invite = await apiClient.request(`/api/invites/${token}`);
    return invite.tripId;
  } catch {
    return null;
  }
}

export function subscribeInvite(token: string, cb: (invite: Invite | null) => void) {
  apiClient
    .request(`/api/invites/${token}`)
    .then((invite) => cb(invite))
    .catch(() => cb(null));

  // Poll for updates
  const interval = setInterval(() => {
    apiClient
      .request(`/api/invites/${token}`)
      .then((invite) => cb(invite))
      .catch(() => cb(null));
  }, 2000);

  return () => clearInterval(interval);
}

export async function joinTripViaInvite(token: string) {
  const result = await apiClient.request(`/api/invites/${token}/join`, {
    method: "POST",
  });
  return result.tripId;
}
