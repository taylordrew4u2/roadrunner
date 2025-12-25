# 🚀 Roadrunner - Getting Started Guide

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ and npm
- Git

### Step 1: Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..
```

### Step 2: Start Both Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
# Opens http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:3001
```

### Step 3: Start Creating Trips! 🎉

Open http://localhost:3000 in your browser and start planning a trip with your friends.

---

## Development Workflow

### Frontend Development
- **Dev Server**: `npm run dev`
- **Type Check**: `npx tsc --noEmit`
- **Lint**: `npm run lint`
- **Build**: `npm run build`

### Backend Development
```bash
cd server
npm run dev    # Start dev server
npm run build  # Compile TypeScript
```

### Making API Changes

1. **Add new endpoint** in `server/index.ts`
2. **Update API call** in `src/lib/firestore.ts`
3. **Update types** as needed
4. **Restart both servers** to test

---

## Project Files to Know

### Frontend (Most Important for UI)
- `src/app/page.tsx` - Home page (trip list)
- `src/app/trip/[id]/page.tsx` - Trip detail view
- `src/components/tabs/` - Tab components (Itinerary, Maps, Notes, etc.)
- `src/lib/firestore.ts` - All API calls to backend
- `src/lib/firebase.ts` - Auth utilities (now just localStorage)

### Backend (REST API)
- `server/index.ts` - All API endpoints
- `server/fly.toml` - Fly.io deployment config
- `server/package.json` - Dependencies

### Configuration
- `.env.local` - Local environment variables
- `wrangler.toml` - Frontend deployment (Cloudflare Pages)

---

## API Reference

### Create a Trip
```bash
curl -X POST http://localhost:3001/api/trips \
  -H "Content-Type: application/json" \
  -H "X-User-ID: your-user-id" \
  -d '{
    "name": "Paris Trip",
    "location": {
      "lat": 48.8566,
      "lng": 2.3522,
      "address": "Paris, France"
    },
    "startDate": "2025-06-01",
    "endDate": "2025-06-08",
    "notificationEnabled": true,
    "ownerUid": "your-user-id"
  }'
```

### Get All Trips
```bash
curl http://localhost:3001/api/trips \
  -H "X-User-ID: your-user-id"
```

### Create Event
```bash
curl -X POST http://localhost:3001/api/trips/TRIP_ID/events \
  -H "Content-Type: application/json" \
  -H "X-User-ID: your-user-id" \
  -d '{
    "day": "2025-06-01",
    "title": "Arrive in Paris",
    "time": "14:00",
    "location": {
      "lat": 48.8566,
      "lng": 2.3522,
      "address": "Charles de Gaulle Airport"
    }
  }'
```

See `server/README.md` for complete API documentation.

---

## Common Tasks

### Add a New Feature
1. Create component in `src/components/`
2. Add API endpoint in `server/index.ts`
3. Add API call in `src/lib/firestore.ts`
4. Use in your component

### Deploy Frontend to Cloudflare Pages
```bash
npm run pages:build
npx wrangler pages deploy .next
```

### Deploy Backend to Fly.io
```bash
cd server
flyctl deploy
```

### Update API URL for Production
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://roadrunner-server.fly.dev
```

---

## Troubleshooting

### Backend not connecting?
- Check both servers are running
- Verify `NEXT_PUBLIC_API_URL` matches backend port
- Check console for CORS errors

### Data not persisting?
- Data is stored in-memory (resets on server restart)
- Use PostgreSQL for persistent storage (see `server/README.md`)

### Port already in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### TypeScript errors?
```bash
# Check for errors
npx tsc --noEmit

# Update types from API response if changed
```

---

## Project Structure at a Glance

```
roadrunner/
├── src/
│   ├── app/               # Pages
│   ├── components/        # React components
│   │   └── tabs/         # Tab UI components
│   ├── lib/              # Utilities & API
│   │   ├── firebase.ts   # Auth (now just localStorage)
│   │   ├── firestore.ts  # All API calls (THIS IS KEY!)
│   │   ├── maps.ts       # Google Maps
│   │   └── auth.ts       # Password utilities
│   └── styles/           # Tailwind CSS
├── server/                # Express backend
│   └── index.ts          # All API endpoints
└── [config files]         # Next.js, Tailwind, etc.
```

---

## Important: How Data Flows

1. **Frontend** renders React components
2. **User action** (create trip, add event, etc.)
3. **API Call** from `src/lib/firestore.ts` to backend
4. **Backend** (Express.js) processes request
5. **Response** sent back to frontend
6. **Frontend** updates state and re-renders

**Real-time updates** use polling (checks every 2 seconds).

---

## Need Help?

- **Backend questions?** → See `server/README.md`
- **Frontend questions?** → See `README.md`
- **Migration info?** → See `MIGRATION_SUMMARY.md`
- **GitHub issues?** → https://github.com/taylordrew4u2/roadrunner/issues

---

**Happy coding! 🎉 Have fun planning trips together!**
