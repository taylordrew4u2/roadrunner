import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
app.use(cors());

// In-memory storage (replace with database in production)
const trips: Map<string, any> = new Map();
const members: Map<string, any[]> = new Map();
const events: Map<string, any[]> = new Map();
const tasks: Map<string, any[]> = new Map();
const notes: Map<string, any> = new Map();
const invites: Map<string, any> = new Map();
const users: Map<string, any> = new Map();

// Auth middleware
function getOrCreateUser(req: Request, res: Response, next: any) {
  let userId = req.headers["x-user-id"] as string;
  
  if (!userId) {
    userId = uuidv4();
    if (!users.has(userId)) {
      users.set(userId, { id: userId, createdAt: new Date() });
    }
  } else if (!users.has(userId)) {
    users.set(userId, { id: userId, createdAt: new Date() });
  }
  
  (req as any).userId = userId;
  res.setHeader("X-User-ID", userId);
  next();
}

app.use(getOrCreateUser);

// Trips
app.post("/api/trips", (req: Request, res: Response) => {
  const { name, location, startDate, endDate, notificationEnabled } = req.body;
  const tripId = uuidv4();
  const trip = {
    id: tripId,
    name,
    location,
    startDate,
    endDate,
    notificationEnabled,
    ownerUid: (req as any).userId,
    createdAt: new Date(),
  };
  trips.set(tripId, trip);
  members.set(tripId, []);
  events.set(tripId, []);
  tasks.set(tripId, []);
  res.json(trip);
});

app.get("/api/trips", (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const userTrips = Array.from(trips.values()).filter((t) => t.ownerUid === userId);
  res.json(userTrips);
});

app.get("/api/trips/:tripId", (req: Request, res: Response) => {
  const trip = trips.get(req.params.tripId);
  if (!trip) return res.status(404).json({ error: "Trip not found" });
  res.json(trip);
});

app.patch("/api/trips/:tripId", (req: Request, res: Response) => {
  const trip = trips.get(req.params.tripId);
  if (!trip) return res.status(404).json({ error: "Trip not found" });
  Object.assign(trip, req.body);
  trip.updatedAt = new Date();
  res.json(trip);
});

// Members
app.get("/api/trips/:tripId/members", (req: Request, res: Response) => {
  const tripMembers = members.get(req.params.tripId) || [];
  res.json(tripMembers);
});

app.post("/api/trips/:tripId/members", (req: Request, res: Response) => {
  const { uid, phone, displayName } = req.body;
  const tripId = req.params.tripId;
  const tripMembers = members.get(tripId) || [];
  
  const member = {
    uid,
    phone,
    displayName,
    role: "member",
    joinedAt: new Date(),
  };
  
  tripMembers.push(member);
  members.set(tripId, tripMembers);
  res.json(member);
});

// Events
app.get("/api/trips/:tripId/events", (req: Request, res: Response) => {
  const tripEvents = events.get(req.params.tripId) || [];
  res.json(tripEvents);
});

app.post("/api/trips/:tripId/events", (req: Request, res: Response) => {
  const { day, title, notes, time, location } = req.body;
  const tripId = req.params.tripId;
  const tripEvents = events.get(tripId) || [];
  
  const event = {
    id: uuidv4(),
    tripId,
    day,
    title,
    notes,
    time,
    location,
    createdBy: (req as any).userId,
    createdAt: new Date(),
  };
  
  tripEvents.push(event);
  events.set(tripId, tripEvents);
  res.json(event);
});

app.delete("/api/trips/:tripId/events/:eventId", (req: Request, res: Response) => {
  const tripId = req.params.tripId;
  const eventId = req.params.eventId;
  const tripEvents = events.get(tripId) || [];
  
  const idx = tripEvents.findIndex((e) => e.id === eventId);
  if (idx === -1) return res.status(404).json({ error: "Event not found" });
  
  tripEvents.splice(idx, 1);
  events.set(tripId, tripEvents);
  res.json({ success: true });
});

// Tasks
app.get("/api/trips/:tripId/tasks", (req: Request, res: Response) => {
  const tripTasks = tasks.get(req.params.tripId) || [];
  res.json(tripTasks);
});

app.post("/api/trips/:tripId/tasks", (req: Request, res: Response) => {
  const { title, notes, dueAt } = req.body;
  const tripId = req.params.tripId;
  const tripTasks = tasks.get(tripId) || [];
  
  const task = {
    id: uuidv4(),
    title,
    notes,
    dueAt,
    createdBy: (req as any).userId,
    checkedBy: [],
    createdAt: new Date(),
  };
  
  tripTasks.push(task);
  tasks.set(tripId, tripTasks);
  res.json(task);
});

app.patch("/api/trips/:tripId/tasks/:taskId/check", (req: Request, res: Response) => {
  const { tripId, taskId } = req.params;
  const { checked } = req.body;
  const userId = (req as any).userId;
  const tripTasks = tasks.get(tripId) || [];
  
  const task = tripTasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });
  
  if (checked) {
    if (!task.checkedBy.includes(userId)) {
      task.checkedBy.push(userId);
    }
  } else {
    task.checkedBy = task.checkedBy.filter((id: string) => id !== userId);
  }
  
  res.json(task);
});

app.delete("/api/trips/:tripId/tasks/:taskId", (req: Request, res: Response) => {
  const { tripId, taskId } = req.params;
  const tripTasks = tasks.get(tripId) || [];
  
  const idx = tripTasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  
  tripTasks.splice(idx, 1);
  tasks.set(tripId, tripTasks);
  res.json({ success: true });
});

// Notes
app.get("/api/trips/:tripId/notes", (req: Request, res: Response) => {
  const tripNotes = notes.get(req.params.tripId) || { content: "" };
  res.json(tripNotes);
});

app.put("/api/trips/:tripId/notes", (req: Request, res: Response) => {
  const { content } = req.body;
  const tripId = req.params.tripId;
  
  const tripNotes = {
    content,
    updatedBy: (req as any).userId,
    updatedAt: new Date(),
  };
  
  notes.set(tripId, tripNotes);
  res.json(tripNotes);
});

// Invites
app.post("/api/trips/:tripId/invites", (req: Request, res: Response) => {
  const tripId = req.params.tripId;
  const token = uuidv4();
  
  const invite = {
    token,
    tripId,
    createdBy: (req as any).userId,
    createdAt: new Date(),
  };
  
  invites.set(token, invite);
  res.json(invite);
});

app.get("/api/invites/:token", (req: Request, res: Response) => {
  const invite = invites.get(req.params.token);
  if (!invite) return res.status(404).json({ error: "Invite not found" });
  res.json(invite);
});

app.post("/api/invites/:token/join", (req: Request, res: Response) => {
  const invite = invites.get(req.params.token);
  if (!invite) return res.status(404).json({ error: "Invite not found" });
  
  const tripId = invite.tripId;
  const userId = (req as any).userId;
  const tripMembers = members.get(tripId) || [];
  
  if (!tripMembers.find((m) => m.uid === userId)) {
    tripMembers.push({
      uid: userId,
      role: "member",
      joinedAt: new Date(),
    });
    members.set(tripId, tripMembers);
  }
  
  res.json({ success: true, tripId });
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
