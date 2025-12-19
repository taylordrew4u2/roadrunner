# Roadrunner 🏃‍♂️

A beautifully designed shared travel itinerary planner for groups.

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)

## ✨ Features

- **Collaborative Trips** — Create trips with dates, destinations, and activities
- **Daily Timelines** — 24-hour timeline per day with event scheduling
- **Google Maps Integration** — View all pins + get directions
- **Ticket Storage** — Upload images/PDFs for flights, hotels, reservations
- **Shared Notes** — Collaborative note-taking for the whole group
- **Smart To-Do Lists** — Tasks require all members to check off before completion
- **Real-time Sync** — Instant updates across all connected users
- **Invite System** — Share trips via secure invite links
- **Dark Mode** — Beautiful glass-morphism UI in light & dark themes

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## 🔧 Environment Setup

Create a `.env.local` file with your Firebase and Google Maps credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Backend | Firebase (Auth, Firestore, Storage) |
| Maps | Google Maps JavaScript API |
| Animations | Framer Motion 12 |
| Typography | Space Grotesk |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (trip list)
│   ├── trip/[id]/         # Trip detail view
│   └── invite/[token]/    # Invite link handler
├── components/
│   ├── tabs/              # Tab components (Itinerary, Maps, etc.)
│   ├── LaunchScreen.tsx   # Animated splash
│   └── TripCreationModal.tsx
├── lib/
│   ├── firebase.ts        # Firebase init & auth
│   ├── firestore.ts       # Data layer & subscriptions
│   └── maps.ts            # Google Maps hook
└── styles/
    └── globals.css        # Tailwind v4 theme & components
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Connect repo and deploy
vercel
```

### Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy .next
```

## 📄 License

MIT

---

Built with ❤️ for travelers who plan together.
