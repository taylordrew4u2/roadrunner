# Roadrunner 🏃‍♂️

A beautifully designed shared travel itinerary planner for groups. Plan together, travel beautifully.

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?logo=tailwindcss)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express)
![Fly.io](https://img.shields.io/badge/Fly.io-Backend-7B3FF2)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

## ✨ Features

- **Collaborative Trips** — Create trips with dates, destinations, and activities for groups
- **Daily Timelines** — Beautiful 24-hour timeline per day with intuitive event scheduling
- **Google Maps Integration** — View all trip pins on an interactive map with directions
- **Ticket Storage** — Securely upload and organize flight, hotel, and reservation documents
- **Shared Notes** — Real-time collaborative note-taking with full group access
- **Smart To-Do Lists** — Tasks require all members to check off before completion
- **Real-time Sync** — Instant updates across all connected users via polling
- **Secure Invite System** — Share trips via encrypted invite links with group members
- **Dark Mode** — Beautiful glass-morphism UI with seamless light & dark theme switching
- **Authentication** — Anonymous yet secure authentication via browser localStorage
- **Responsive Design** — Works perfectly on mobile, tablet, and desktop devices

## 🚀 Quick Start

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Backend
```bash
# Install backend dependencies
cd server
npm install

# Start backend server (runs on port 3001)
npm run dev
```

## 🔧 Environment Setup

### Frontend Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

For production, update `NEXT_PUBLIC_API_URL` to your Fly.io backend URL.

### Backend Setup

The backend requires no environment variables for local development. For production deployment to Fly.io:

```bash
cd server
flyctl launch --name roadrunner-server
flyctl deploy
```

## 🏗️ Tech Stack

| Layer | Technology |
| ------- | ------------ |
| Frontend | Next.js 15.5 (App Router, RSC, SSR) |
| UI | React 18, Tailwind CSS 4, Framer Motion |
| Backend | Node.js, Express 4.18, TypeScript |
| Database | In-memory (replaceable with PostgreSQL, MongoDB, etc.) |
| Maps | Google Maps JavaScript API |
| Animations | Framer Motion 12, Custom CSS |
| Deployment | Cloudflare Pages (frontend), Fly.io (backend) |
| Package Manager | npm |

## 📁 Project Structure

```txt
roadrunner/
├── src/                    # Frontend Next.js app
│   ├── app/               # Next.js App Router pages
│   │   ├── page.tsx       # Home (trip list)
│   │   ├── trip/[id]/     # Trip detail view with tabs
│   │   └── invite/[token]/# Invite link handler
│   ├── components/
│   │   ├── tabs/          # Tab components
│   │   │   ├── ItineraryTab.tsx
│   │   │   ├── MapsTab.tsx
│   │   │   ├── TicketsTab.tsx
│   │   │   ├── NotesTab.tsx
│   │   │   ├── ToDoTab.tsx
│   │   │   └── MembersTab.tsx
│   │   ├── LaunchScreen.tsx
│   │   ├── TripCreationModal.tsx
│   │   ├── LocationPickerModal.tsx
│   │   └── ThemeToggle.tsx
│   ├── lib/
│   │   ├── firebase.ts    # API client & auth utilities
│   │   ├── firestore.ts   # Data layer & API calls
│   │   ├── maps.ts        # Google Maps integration
│   │   ├── auth.ts        # Utilities
│   │   └── notifications.ts
│   └── styles/
│       └── globals.css    # Tailwind v4
├── server/                # Express.js backend
│   ├── index.ts           # Main server & API endpoints
│   ├── package.json
│   ├── tsconfig.json
│   ├── fly.toml           # Fly.io configuration
│   ├── Dockerfile
│   └── README.md          # Backend documentation
├── package.json
├── wrangler.toml          # Cloudflare Pages config
└── README.md
```

## 🌐 Deployment

### Frontend - Cloudflare Pages

```bash
npm run pages:build
npx wrangler pages deploy .next
```

**Status**: ✅ Production-ready
- Optimized for Cloudflare Pages
- Environment variables managed in dashboard
- Auto-deploys from GitHub

### Backend - Fly.io

See [server/README.md](./server/README.md) for detailed backend deployment instructions.

```bash
cd server
npm run deploy
```

## 🏗️ Architecture

### Request Flow
1. **Frontend** (Next.js) sends requests to backend API
2. **Backend** (Express.js on Fly.io) processes requests
3. **Data** is stored in-memory (or in a database like PostgreSQL)
4. **Real-time updates** use polling from the frontend

### Authentication
- Anonymous UUID-based authentication
- User ID stored in browser localStorage
- Passed to backend via `X-User-ID` header

### Data Model

**Trips**
- id, name, location, startDate, endDate, ownerUid, createdAt

**Trip Members**
- uid, phone, role, displayName, joinedAt

**Itinerary Events**
- id, tripId, day, title, notes, time, location, createdBy, createdAt

**Tasks (To-Do)**
- id, title, notes, dueAt, createdBy, checkedBy[], createdAt

**Notes**
- content, updatedBy, updatedAt

**Invites**
- token, tripId, createdBy, createdAt

## 🚀 Recent Updates

### v2.0 - Fly.io Backend Release ✨
- Migrated from Firebase/Firestore to Express.js backend
- Deployed backend on Fly.io platform
- Implemented polling for real-time updates
- Added complete backend API documentation
- Removed Firebase dependencies

### v1.0 - Production Release
- Fixed Vercel deployment issues
- Resolved hydration mismatches in theme switching
- Optimized CSS for Tailwind v4 compatibility
- Enhanced error handling in async operations

## 🛣️ Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] WebSocket support for true real-time updates
- [ ] Drag-and-drop event scheduling
- [ ] Budget tracking and expense splitting
- [ ] Weather forecasts for destinations
- [ ] Photo sharing and albums
- [ ] Offline mode support
- [ ] Mobile app (React Native)
- [ ] Chat/messaging between members
- [ ] Trip templates and suggestions

## 🐛 Known Issues & Limitations

- Data is stored in-memory (resets on server restart)
- Invite links don't expire
- No image compression before upload
- Anonymous auth allows no persistent user profiles
- No backup/restore functionality

## 🤝 Contributing

Contributions welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
# Clone and install
git clone https://github.com/taylordrew4u2/roadrunner.git
cd roadrunner
npm install

# Start frontend dev server
npm run dev

# In another terminal, start backend
cd server
npm install
npm run dev

# Run type check
npx tsc --noEmit

# Run linter
npm run lint
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes

---

**Built with ❤️ for travelers who plan together.**

Questions? Open an issue on [GitHub](https://github.com/taylordrew4u2/roadrunner/issues)

Last updated: December 2025
