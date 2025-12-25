# Migration Summary: Firebase → Fly.io Backend

## Overview
Successfully migrated the Roadrunner trip planning application from Firebase/Firestore to a custom Express.js backend deployed on Fly.io.

## What Changed

### ✅ Removed
- Firebase dependencies (`firebase` package)
- Firebase configuration (API keys, project IDs, auth domain)
- Firestore real-time listeners
- Firebase authentication
- All `.env.example` Firebase configuration

### ✅ Added

#### Backend (New `/server` directory)
- **Express.js REST API** with complete endpoints for:
  - Trips (create, read, update)
  - Members (list, add)
  - Events/Itinerary (create, delete, list)
  - Tasks/To-Do (create, delete, check, list)
  - Notes (get, update)
  - Invites (create, list, join)
- **TypeScript** configuration for type safety
- **Fly.io deployment configuration** (fly.toml)
- **Docker support** for containerized deployment
- **Health check endpoint** for monitoring
- **CORS enabled** for development flexibility

#### Frontend Updates
- Replaced `firebase.ts` with lightweight API client using fetch
- Converted `firestore.ts` from real-time listeners to API calls with polling (2-second intervals)
- Removed all Firebase imports and dependencies
- Implemented localStorage-based anonymous user ID generation
- Added `X-User-ID` header for user identification

#### Configuration Files
- **package.json**: Removed `firebase` dependency
- **wrangler.toml**: Updated to reference Fly.io backend URL
- **.env.local**: Updated to use `NEXT_PUBLIC_API_URL` instead of Firebase keys
- **.env.example**: Simplified to only require API URL and Google Maps key

#### Documentation
- **server/README.md**: Complete backend documentation including:
  - API endpoint reference
  - Local development setup
  - Deployment instructions
  - Environment variables guide
- **README.md**: Updated to reflect new architecture and deployment process

## Data Persistence
Currently uses **in-memory storage** on the Express server. For production, integrate:
- PostgreSQL (recommended for Fly.io)
- MongoDB
- Any other persistent database

## Authentication Flow
**Before (Firebase):**
- Firebase authentication service
- Cloud-managed session
- Automatic user persistence

**After (Fly.io):**
- Browser localStorage generates UUID
- UUID passed via `X-User-ID` header
- Server generates new UUID if not present
- Simple and portable, no external auth service

## Real-time Sync
**Before (Firebase):**
- Real-time Firestore listeners (onSnapshot)
- WebSocket-like updates
- Instant synchronization

**After (Fly.io):**
- Poll-based updates (2-second interval)
- Simpler architecture, no WebSocket setup
- Can be upgraded to WebSocket later

## File Structure

```
roadrunner/
├── src/                          # Frontend
│   ├── lib/
│   │   ├── firebase.ts (UPDATED)  # Now API client
│   │   └── firestore.ts (UPDATED) # Now API calls
│   ├── app/
│   ├── components/
│   └── styles/
├── server/ (NEW)                 # Backend
│   ├── index.ts                  # Express app & endpoints
│   ├── package.json              # Server dependencies
│   ├── tsconfig.json
│   ├── fly.toml                  # Fly.io config
│   ├── Dockerfile
│   └── README.md
├── package.json (UPDATED)
├── wrangler.toml (UPDATED)
├── .env.local (UPDATED)
├── .env.example (UPDATED)
└── README.md (UPDATED)
```

## API Endpoints Summary

### Base URL
- Development: `http://localhost:3001`
- Production: `https://roadrunner-server.fly.dev` (update as needed)

### Core Endpoints
- `POST /api/trips` - Create trip
- `GET /api/trips` - List user's trips
- `GET /api/trips/:tripId` - Get trip details
- `GET /api/trips/:tripId/members` - List members
- `POST /api/trips/:tripId/members` - Add member
- `GET /api/trips/:tripId/events` - List events
- `POST /api/trips/:tripId/events` - Create event
- `DELETE /api/trips/:tripId/events/:eventId` - Delete event
- `GET /api/trips/:tripId/tasks` - List tasks
- `POST /api/trips/:tripId/tasks` - Create task
- `PATCH /api/trips/:tripId/tasks/:taskId/check` - Toggle task
- `DELETE /api/trips/:tripId/tasks/:taskId` - Delete task
- `GET /api/trips/:tripId/notes` - Get notes
- `PUT /api/trips/:tripId/notes` - Update notes
- `POST /api/trips/:tripId/invites` - Create invite
- `GET /api/invites/:token` - Get invite info
- `POST /api/invites/:token/join` - Join via invite
- `GET /health` - Health check

## Deployment Instructions

### Frontend (Cloudflare Pages)
```bash
npm run pages:build
npx wrangler pages deploy .next
```

### Backend (Fly.io)
```bash
cd server
flyctl launch --name roadrunner-server
npm run deploy
```

## Local Development

### Terminal 1: Frontend
```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

### Terminal 2: Backend
```bash
cd server
npm install
npm run dev
# Runs on http://localhost:3001
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

### Backend
No environment variables required for local development.

## Next Steps

1. **Database Integration**: Replace in-memory storage with PostgreSQL
2. **WebSocket Support**: Upgrade from polling to WebSocket for real-time updates
3. **Authentication**: Add proper user authentication if needed
4. **Error Handling**: Add comprehensive error logging and monitoring
5. **Validation**: Add request/response validation
6. **Rate Limiting**: Implement API rate limiting
7. **Testing**: Add unit and integration tests

## Rollback
If you need to rollback to Firebase:
1. Restore `firebase` dependency in package.json
2. Restore original `firebase.ts` and `firestore.ts` files
3. Restore `.env` variables
4. Update imports in components

All files are properly version controlled, so you can `git revert` if needed.

## Support
- Backend docs: See `server/README.md`
- Frontend docs: See `README.md`
- For API questions: Check `server/README.md` endpoint reference
