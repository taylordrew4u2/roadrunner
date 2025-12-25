# Frontend API Integration Guide

## Overview

The frontend communicates with the Fly.io Express backend via REST API calls. This document explains how the integration works and how to modify it.

## Key Files

### `src/lib/firebase.ts` - API Client
This file contains:
- `ensureAnonymousAuth()` - Gets or creates a user ID
- `getCurrentUserId()` - Returns current user's ID
- `apiClient.request()` - Makes HTTP requests to backend

### `src/lib/firestore.ts` - Data Layer
This file contains all functions that call the backend API:
- Trip operations (create, get, list, update)
- Member operations (add, list)
- Event operations (add, delete, list)
- Task operations (add, delete, check, list)
- Note operations (get, update)
- Invite operations (create, get, list, join)

## How It Works

### User Authentication

**Before (Firebase):**
```typescript
// Automatic Firebase authentication
await signInAnonymously(auth);
const userId = auth.currentUser?.uid;
```

**After (Fly.io):**
```typescript
// Generate UUID and store in localStorage
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = generateUUID();
  localStorage.setItem("userId", userId);
}
// Send with each request
headers["X-User-ID"] = userId;
```

**Key differences:**
- No external auth service
- UUID persists in browser localStorage
- Server generates new UUID if not provided

### Making API Calls

Every function in `firestore.ts` uses `apiClient.request()`:

```typescript
export async function createTrip(trip: Trip) {
  const result = await apiClient.request("/api/trips", {
    method: "POST",
    body: JSON.stringify(trip),
  });
  return result.id;
}
```

**What happens:**
1. `apiClient.request()` gets the current user ID
2. Adds `X-User-ID` header
3. Makes fetch request to backend
4. Parses JSON response
5. Returns data

### Real-time Updates

**Before (Firebase):**
```typescript
const unsubscribe = onSnapshot(ref, (snap) => {
  cb(snap.data());
});
// Called instantly when data changes
```

**After (Fly.io):**
```typescript
export function subscribeTrips(uid: string, cb: (docs: Trip[]) => void) {
  // Initial fetch
  apiClient.request("/api/trips").then((trips) => cb(trips));

  // Poll every 2 seconds
  const interval = setInterval(() => {
    apiClient.request("/api/trips")
      .then((trips) => cb(trips))
      .catch(() => cb([]));
  }, 2000);

  // Return cleanup function
  return () => clearInterval(interval);
}
```

**Key differences:**
- Not true real-time (2-second delay)
- Uses polling instead of WebSocket
- Simpler implementation
- Can be upgraded to WebSocket later

## API Endpoint Reference

### Trips
```typescript
// Create
createTrip(trip: Trip): Promise<string>
POST /api/trips

// List
subscribeTrips(uid: string, cb: Callback): Unsubscribe
GET /api/trips

// Get single
subscribeTrip(tripId: string, cb: Callback): Unsubscribe
GET /api/trips/:tripId

// Update
PATCH /api/trips/:tripId
```

### Members
```typescript
// List
subscribeTripMembers(tripId: string, cb: Callback): Unsubscribe
GET /api/trips/:tripId/members

// Add
addMember(tripId: string, member: TripMember): Promise<void>
POST /api/trips/:tripId/members
```

### Events
```typescript
// List
subscribeEvents(tripId: string, cb: Callback): Unsubscribe
GET /api/trips/:tripId/events

// Create
addEvent(tripId: string, event: ItineraryEvent): Promise<void>
POST /api/trips/:tripId/events

// Delete
DELETE /api/trips/:tripId/events/:eventId
```

### Tasks
```typescript
// List
subscribeTasks(tripId: string, cb: Callback): Unsubscribe
GET /api/trips/:tripId/tasks

// Create
addTask(tripId: string, task: Task): Promise<void>
POST /api/trips/:tripId/tasks

// Toggle completion
toggleTaskCheck(tripId, taskId, uid, checked): Promise<void>
PATCH /api/trips/:tripId/tasks/:taskId/check

// Delete
DELETE /api/trips/:tripId/tasks/:taskId
```

### Notes
```typescript
// Get
subscribeNotes(tripId: string, cb: Callback): Unsubscribe
GET /api/trips/:tripId/notes

// Update
upsertNotes(tripId: string, content: string, uid: string): Promise<void>
PUT /api/trips/:tripId/notes
```

### Invites
```typescript
// Create
createInvite(tripId: string, createdBy: string): Promise<string>
POST /api/trips/:tripId/invites

// Get
getInvite(token: string): Promise<string | null>
GET /api/invites/:token

// Get (with subscribe)
subscribeInvite(token: string, cb: Callback): Unsubscribe
GET /api/invites/:token

// Join
joinTripViaInvite(token: string): Promise<string>
POST /api/invites/:token/join
```

## Using in Components

### Example: List Trips
```typescript
import { subscribeTrips, Trip } from "@/lib/firestore";
import { onAuthReady } from "@/lib/firebase";

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    onAuthReady().then((userId) => {
      const unsubscribe = subscribeTrips(userId, setTrips);
      return unsubscribe;
    });
  }, []);

  return (
    <div>
      {trips.map((trip) => (
        <div key={trip.id}>{trip.name}</div>
      ))}
    </div>
  );
}
```

### Example: Create Trip
```typescript
import { createTrip } from "@/lib/firestore";
import { getCurrentUserId } from "@/lib/firebase";

async function handleCreateTrip() {
  const newTrip = {
    name: "Paris Trip",
    location: { lat: 48.8566, lng: 2.3522, address: "Paris" },
    startDate: "2025-06-01",
    endDate: "2025-06-08",
    notificationEnabled: true,
    ownerUid: getCurrentUserId(),
  };

  const tripId = await createTrip(newTrip);
  console.log("Created trip:", tripId);
}
```

### Example: Real-time Updates
```typescript
import { subscribeEvents } from "@/lib/firestore";

useEffect(() => {
  const unsubscribe = subscribeEvents(tripId, (events) => {
    setEvents(events);
  });

  // Cleanup subscription when component unmounts
  return unsubscribe;
}, [tripId]);
```

## Error Handling

### Current Implementation
```typescript
export function subscribeTrips(uid: string, cb: (docs: Trip[]) => void) {
  apiClient
    .request("/api/trips")
    .then((trips) => cb(trips))
    .catch(() => cb([])); // Returns empty array on error
}
```

### Better Error Handling
```typescript
export function subscribeTrips(
  uid: string,
  cb: (docs: Trip[]) => void,
  onError: (err: Error) => void = () => {}
) {
  const poll = async () => {
    try {
      const trips = await apiClient.request("/api/trips");
      cb(trips);
    } catch (error) {
      onError(error as Error);
    }
  };

  poll();
  const interval = setInterval(poll, 2000);
  return () => clearInterval(interval);
}
```

## Upgrading to WebSocket (Future)

Current polling approach can be replaced with WebSocket for true real-time:

```typescript
// Future: WebSocket implementation
function subscribeTrips(uid: string, cb: (docs: Trip[]) => void) {
  const ws = new WebSocket("wss://roadrunner-server.fly.dev/ws");
  
  ws.onmessage = (event) => {
    const trips = JSON.parse(event.data);
    cb(trips);
  };

  return () => ws.close();
}
```

## Migrating from Firebase to Different Backend

To use a different backend service, you only need to update:

1. **`src/lib/firebase.ts`** - Update `API_URL` and `apiClient.request()`
2. **`src/lib/firestore.ts`** - Update API endpoints if different

All components stay the same because they use the interface exported from these files.

## Testing API Locally

### Check Server Health
```bash
curl http://localhost:3001/health
```

### Create Test Trip
```bash
curl -X POST http://localhost:3001/api/trips \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user" \
  -d '{
    "name": "Test Trip",
    "location": {"lat": 0, "lng": 0, "address": "Test"},
    "startDate": "2025-01-01",
    "endDate": "2025-01-02",
    "notificationEnabled": false,
    "ownerUid": "test-user"
  }'
```

### List Trips
```bash
curl http://localhost:3001/api/trips \
  -H "X-User-ID: test-user"
```

## Common Issues & Solutions

### Issue: "API Error: 404"
**Cause:** Endpoint doesn't exist or wrong URL
**Solution:** Check `NEXT_PUBLIC_API_URL` in `.env.local`, verify endpoint in `server/index.ts`

### Issue: User ID not persisting
**Cause:** localStorage not available or cleared
**Solution:** Check browser privacy settings, ensure localStorage is enabled

### Issue: Data not updating
**Cause:** Polling might be too slow or paused
**Solution:** Check network tab, ensure both servers running, increase poll frequency

### Issue: CORS errors
**Cause:** Backend CORS configuration
**Solution:** Check CORS origin in `server/index.ts` line with `app.use(cors())`

## Performance Considerations

### Polling Overhead
- Current: 2-second poll interval = 30 requests/minute per subscription
- Solution: Implement WebSocket or server-sent events

### Memory Usage
- Backend: In-memory storage grows with data
- Solution: Implement database with pagination

### Frontend Bundle Size
- No Firebase overhead (removed ~50KB)
- Small API client (~1KB)
- Minimal added complexity

## Security Notes

### Current Implementation
- User ID sent in header (not secure for production)
- No authentication validation
- No rate limiting

### For Production
- Implement proper JWT authentication
- Add request validation
- Enable rate limiting
- Use HTTPS only
- Implement CSRF protection
- Add request signing

---

For more information, see:
- Backend docs: `server/README.md`
- Migration info: `MIGRATION_SUMMARY.md`
- Quick start: `GETTING_STARTED.md`
