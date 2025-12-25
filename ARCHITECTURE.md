# 📋 Architecture Overview: Roadrunner v2.0

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Next.js Frontend (React)                      │ │
│  │  - Runs on http://localhost:3000                           │ │
│  │  - Cloudflare Pages in production                          │ │
│  │                                                             │ │
│  │  Components:                                               │ │
│  │  ├── src/app/page.tsx (Home/Trip List)                    │ │
│  │  ├── src/app/trip/[id]/page.tsx (Trip Detail)            │ │
│  │  ├── src/components/tabs/ (UI Components)                │ │
│  │  └── src/lib/firebase.ts (API Client)                    │ │
│  │      src/lib/firestore.ts (API Calls)                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                    HTTP REST API Calls                           │
│                    X-User-ID Header                              │
│                    (2-second polling)                            │
│                           │                                       │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │
                    INTERNET / Network
                             │
                             │
┌─────────────────────────────────────────────────────────────────┐
│                      FLY.IO CLOUD PLATFORM                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            Express.js Backend Server                       │ │
│  │  - Runs on http://localhost:3001 (local)                  │ │
│  │  - https://roadrunner-server.fly.dev (production)         │ │
│  │                                                             │ │
│  │  server/index.ts contains:                                 │ │
│  │  ├── GET/POST /api/trips                                  │ │
│  │  ├── GET/POST /api/trips/:id/members                      │ │
│  │  ├── GET/POST/DELETE /api/trips/:id/events               │ │
│  │  ├── GET/POST/PATCH/DELETE /api/trips/:id/tasks          │ │
│  │  ├── GET/PUT /api/trips/:id/notes                        │ │
│  │  ├── POST/GET /api/trips/:id/invites                     │ │
│  │  └── POST /api/invites/:token/join                       │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                    In-Memory Storage                             │
│                    (Replace with DB)                             │
│                           │                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Data Storage (Currently In-Memory)                │ │
│  │                                                             │ │
│  │  For Production, integrate:                                │ │
│  │  - PostgreSQL (recommended)                                │ │
│  │  - MongoDB                                                 │ │
│  │  - MySQL                                                   │ │
│  │  - Firebase (if reverting)                                 │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PLATFORMS                          │
│                                                                  │
│  Frontend:                  Backend:                             │
│  Cloudflare Pages          Fly.io                               │
│  (CDN + Caching)           (Container + Auto-scale)             │
│                                                                  │
│  External APIs:                                                  │
│  - Google Maps (maps.ts)                                         │
│  - Firebase Storage (optional, for future)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│   User      │
│ Interacts   │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│  React Component                     │
│  (src/components/tabs/TabName.tsx)  │
└──────────────────────────────────────┘
       │
       │ Calls function from firestore.ts
       ▼
┌──────────────────────────────────────┐
│  API Call (firestore.ts)             │
│  e.g. createTrip(tripData)          │
└──────────────────────────────────────┘
       │
       │ Uses apiClient.request()
       │ Adds X-User-ID header
       ▼
┌──────────────────────────────────────┐
│  fetch() to Express.js               │
│  POST /api/trips                     │
└──────────────────────────────────────┘
       │
       │ HTTP Request over network
       ▼
┌──────────────────────────────────────┐
│  Express.js Route Handler            │
│  (server/index.ts:53)                │
└──────────────────────────────────────┘
       │
       │ Process request
       ▼
┌──────────────────────────────────────┐
│  In-Memory Storage                   │
│  Map<string, Trip>                   │
└──────────────────────────────────────┘
       │
       │ Response JSON
       ▼
┌──────────────────────────────────────┐
│  Frontend Receives Response           │
│  JSON.parse()                        │
└──────────────────────────────────────┘
       │
       │ Update state (setState/useState)
       ▼
┌──────────────────────────────────────┐
│  Component Re-renders                │
│  UI Updates                          │
└──────────────────────────────────────┘
```

## Real-time Update Flow

```
┌─────────────────────────────────────────┐
│  subscribeTrips(userId, callback)       │
│  (src/lib/firestore.ts:81)              │
└────────────┬────────────────────────────┘
             │
             ├─► Initial Fetch
             │   GET /api/trips
             │
             │   Response → Callback(trips)
             │   → setState(trips)
             │   → Component Re-renders
             │
             └─► setInterval(2000)
                 ├─► 0s   : Initial fetch ✓
                 ├─► 2s   : Poll for updates
                 ├─► 4s   : Poll for updates
                 ├─► 6s   : Poll for updates
                 └─► ... continues until cleanup
                
                 When component unmounts:
                 clearInterval() → Stops polling
```

## File Organization

```
roadrunner/
├── 📄 README.md                      ← Main project docs
├── 📄 GETTING_STARTED.md             ← Quick start guide
├── 📄 MIGRATION_SUMMARY.md           ← What changed
├── 📄 COMPLETION_REPORT.md           ← This report
├── 📄 FRONTEND_API_INTEGRATION.md    ← API details
├── 📄 COMPLETION_REPORT.md           ← Migration complete
├── 📦 package.json                   ← Frontend deps
├── 📦 .env.local                     ← Local config
├── 📦 .env.example                   ← Example config
├── 📦 wrangler.toml                  ← Cloudflare config
│
├── 📁 src/                           ← Frontend Next.js app
│   ├── app/
│   │   ├── page.tsx                  ← Home page
│   │   ├── trip/[id]/page.tsx        ← Trip detail
│   │   └── invite/[token]/page.tsx   ← Invite handler
│   ├── components/
│   │   ├── tabs/                     ← Tab UIs
│   │   │   ├── ItineraryTab.tsx
│   │   │   ├── MapsTab.tsx
│   │   │   ├── NotesTab.tsx
│   │   │   ├── TicketsTab.tsx
│   │   │   ├── ToDoTab.tsx
│   │   │   └── MembersTab.tsx
│   │   ├── TripCreationModal.tsx
│   │   ├── LocationPickerModal.tsx
│   │   └── LaunchScreen.tsx
│   ├── lib/
│   │   ├── firebase.ts              ← ✨ NEW: API client
│   │   ├── firestore.ts             ← ✨ NEW: API calls
│   │   ├── maps.ts                  ← Google Maps
│   │   ├── auth.ts                  ← Auth utils
│   │   └── notifications.ts         ← FCM setup
│   └── styles/
│       └── globals.css              ← Tailwind CSS
│
└── 📁 server/ (✨ NEW BACKEND)        ← Express.js backend
    ├── 📄 README.md                 ← Backend docs
    ├── 📄 fly.toml                  ← Fly.io deployment
    ├── 📄 Dockerfile                ← Container image
    ├── 📄 tsconfig.json             ← TypeScript config
    ├── 📦 package.json              ← Backend deps
    ├── 📄 index.ts                  ← ✨ Express server
    │                                  18+ API endpoints
    └── 📁 dist/                     ← Compiled JS (built)
```

## Technology Stack

```
FRONTEND (Cloudflare Pages)           BACKEND (Fly.io)
├─ Next.js 15.5                      ├─ Node.js 20
├─ React 18.3                        ├─ Express.js 4.18
├─ TypeScript 5.9                    ├─ TypeScript 5.0
├─ Tailwind CSS 4.1                  ├─ CORS 2.8
├─ Framer Motion 12.23               └─ UUID 9.0
├─ Google Maps API
└─ Zustand (state management)        DATABASE (Future)
                                     └─ PostgreSQL, MongoDB, etc.
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│              GitHub Repository                          │
│  taylordrew4u2/roadrunner                              │
└──────────────┬──────────────────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌────────────────┐
│  Push to     │  │  Push to       │
│  main branch │  │  main branch   │
└──────┬───────┘  └────────┬───────┘
       │                   │
       ▼                   ▼
┌────────────────────┐  ┌──────────────────┐
│ Cloudflare Pages   │  │ Fly.io CLI       │
│                    │  │                  │
│ Auto-deploys on    │  │ Manual or CI/CD   │
│ push to main       │  │ npm run deploy   │
│                    │  │                  │
│ https://roadrunner │  │ https://roadrunner
│ -RANDOM.pages.dev  │  │ -server.fly.dev  │
└────────────────────┘  └──────────────────┘
```

## API Endpoint Map

```
/api
├── /trips
│   ├── POST         Create trip
│   ├── GET          List user's trips
│   └── /:tripId
│       ├── GET      Get trip details
│       ├── PATCH    Update trip
│       ├── /members
│       │   ├── GET  List members
│       │   └── POST Add member
│       ├── /events
│       │   ├── GET     List events
│       │   ├── POST    Create event
│       │   └── /:id
│       │       └── DELETE Delete event
│       ├── /tasks
│       │   ├── GET     List tasks
│       │   ├── POST    Create task
│       │   ├── /:id
│       │   │   └── DELETE Delete task
│       │   └── /:id/check
│       │       └── PATCH Toggle completion
│       ├── /notes
│       │   ├── GET Get notes
│       │   └── PUT Update notes
│       └── /invites
│           ├── POST Create invite
│           └── /:token/join POST Join trip
├── /invites
│   └── /:token GET Get invite details
│
└── /health GET Server health check
```

## Development Commands

```
FRONTEND:
  npm install              Install dependencies
  npm run dev              Start dev server (port 3000)
  npm run build            Build for production
  npm run pages:build      Build for Cloudflare
  npm run lint             Check TypeScript

BACKEND:
  cd server
  npm install              Install dependencies
  npm run dev              Start dev server (port 3001)
  npm run build            Compile TypeScript
  npm start                Run compiled JS
  npm run deploy           Deploy to Fly.io

FULL SETUP:
  # Terminal 1
  npm install && npm run dev

  # Terminal 2
  cd server && npm install && npm run dev

DEPLOYMENT:
  # Frontend to Cloudflare Pages
  npm run pages:build
  npx wrangler pages deploy .next

  # Backend to Fly.io
  cd server && npm run deploy
```

## Key Differences from Previous Version

| Aspect | Before (Firebase) | After (Fly.io) |
|--------|-------------------|----------------|
| **Backend** | Google-managed | Self-hosted Express.js |
| **Database** | Firestore | In-memory (replaceable) |
| **Auth** | Firebase Auth | localStorage UUID |
| **Real-time** | WebSocket listeners | 2-second polling |
| **Updates** | Instant | ~2s delay |
| **Control** | Google (limited) | Full control |
| **Cost** | Pay-as-you-go | Predictable/cheap |
| **Complexity** | Medium | Lower |

## Security & Production Considerations

**Current (Dev):**
- ✅ CORS open
- ✅ In-memory storage
- ⚠️ No auth validation

**For Production:**
- [ ] Add JWT authentication
- [ ] Implement database (PostgreSQL)
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Restrict CORS origins
- [ ] Add request validation
- [ ] Add error logging
- [ ] Set up monitoring
- [ ] Add backup strategy

---

**This architecture is:**
- ✅ Scalable (can add database)
- ✅ Maintainable (clear separation)
- ✅ Deployable (Cloudflare + Fly.io)
- ✅ Cost-effective (both platforms free tier)
- ✅ Future-proof (can add features)
