# Roadrunner 🏃‍♂️

A beautifully designed shared travel itinerary planner for groups. Plan together, travel beautifully.

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-12.7.0-FFCA28?logo=firebase)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

## ✨ Features

- **Collaborative Trips** — Create trips with dates, destinations, and activities for groups
- **Daily Timelines** — Beautiful 24-hour timeline per day with intuitive event scheduling
- **Google Maps Integration** — View all trip pins on an interactive map with directions
- **Ticket Storage** — Securely upload and organize flight, hotel, and reservation documents
- **Shared Notes** — Real-time collaborative note-taking with full group access
- **Smart To-Do Lists** — Tasks require all members to check off before completion
- **Real-time Sync** — Instant updates across all connected users using Firestore
- **Secure Invite System** — Share trips via encrypted invite links with group members
- **Dark Mode** — Beautiful glass-morphism UI with seamless light & dark theme switching
- **Authentication** — Anonymous yet secure authentication via Firebase
- **Responsive Design** — Works perfectly on mobile, tablet, and desktop devices

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
| ------- | ------------ |
| Framework | Next.js 15.5 (App Router, RSC, SSR) |
| UI | React 18, Tailwind CSS 4, Framer Motion |
| Backend | Firebase (Auth, Firestore, Storage) |
| Maps | Google Maps JavaScript API |
| Animations | Framer Motion 12, Custom CSS |
| Typography | Space Grotesk, system fonts |
| Deployment | Vercel, Cloudflare Pages |
| Package Manager | npm with workspace optimization |

## 📁 Project Structure

```txt
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (trip list & auth gate)
│   ├── trip/[id]/         # Trip detail view with tabs
│   └── invite/[token]/    # Invite link handler
├── components/
│   ├── tabs/              # Tab components
│   │   ├── ItineraryTab.tsx
│   │   ├── MapsTab.tsx
│   │   ├── TicketsTab.tsx
│   │   ├── NotesTab.tsx
│   │   ├── ToDoTab.tsx
│   │   └── MembersTab.tsx
│   ├── LaunchScreen.tsx   # Animated splash screen
│   ├── TripCreationModal.tsx
│   ├── LocationPickerModal.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── firebase.ts        # Firebase init & auth
│   ├── firestore.ts       # Data layer & real-time subscriptions
│   ├── maps.ts            # Google Maps integration
│   ├── auth.ts            # Password gate utilities
│   └── notifications.ts   # FCM setup
└── styles/
    └── globals.css        # Tailwind v4 + custom components
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Deploy in one command
vercel
```

**Status**: ✅ Production-ready and Vercel-optimized
- Server-side rendering (SSR) enabled
- Incremental Static Regeneration (ISR) configured
- Edge caching optimized
- Environment variables pre-configured

### Cloudflare Pages

```bash
npm run pages:build
npx wrangler pages deploy .next
```

## 🏗️ Architecture

### Real-time Data Flow
1. **Firestore** as single source of truth
2. **Cloud Functions** (optional) for complex operations
3. **React Context** for client-side state management
4. **Real-time Listeners** for live updates across users

### Authentication
- Anonymous Firebase authentication
- Optional password gate (`NEXT_PUBLIC_APP_PASS_HASH`)
- Session persistence via browser storage

### Performance
- Code splitting per route
- Image optimization via Next.js Image
- CSS-in-JS with Tailwind for minimal bundle
- Lazy loading for heavy components

## 📊 Data Model

### Collections
- **trips** — Trip metadata (name, dates, location, members)
- **itinerary** — Daily events with times and descriptions
- **notes** — Shared collaborative notes
- **todos** — Task items with completion status
- **tickets** — Document uploads and metadata
- **invites** — Temporary invite tokens with expiration

## 🚀 Recent Updates

### v1.0 - Production Release ✨
- Fixed Vercel deployment issues
- Resolved hydration mismatches in theme switching
- Optimized CSS for Tailwind v4 compatibility
- Enhanced error handling in async operations
- Improved TypeScript type safety

## 🛣️ Roadmap

- [ ] Drag-and-drop event scheduling
- [ ] Budget tracking and expense splitting
- [ ] Weather forecasts for destinations
- [ ] Photo sharing and albums
- [ ] Offline mode support
- [ ] Mobile app (React Native)
- [ ] Chat/messaging between members
- [ ] Trip templates and suggestions

## 🐛 Known Issues & Limitations

- Invite links don't expire (can be generated indefinitely)
- No image compression before upload
- Google Maps requires valid API key for all users
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

# Start dev server
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
