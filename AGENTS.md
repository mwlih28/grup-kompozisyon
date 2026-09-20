# Grup Kompozisyon - Developer Guide

## Project Overview
Grup Kompozisyon is a Next.js 14 app that lets groups create AI-powered unique compositions.
Members join via invite links, an admin sets a topic, and the AI generates a unique composition for each member.

## Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS 3**
- **Radix UI** primitives
- **Lucide React** icons
- **Supabase** (optional, for production data storage)
- **Capacitor 6** (iOS + Android native builds)
- **PWA** (service worker, web app manifest)

## Development Commands

### Web
```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

### Mobile (Capacitor)
```bash
npm run dev      # Start Next.js dev server first (localhost:3000)

# In a separate terminal:
npx cap open android   # Open Android project in Android Studio
npx cap open ios       # Open iOS project in Xcode (macOS only)

# Sync web assets to native projects after changes
npx cap copy

# Dev workflow: Run Next.js dev server + `npx cap open android/ios`
# The native app loads from http://localhost:3000 (or http://10.0.2.2:3000 on Android emulator)
```

### iOS Build (Mac required)
1. Ensure Xcode is installed (free from Mac App Store)
2. Apple Developer account ($99/year) for device testing & App Store
3. Run: `npx cap open ios`
4. In Xcode: Product → Run (builds to simulator or connected device)
5. For App Store: Product → Archive → Distribute

### Android Build
1. Ensure Android Studio is installed with SDK
2. Run: `npx cap open android`
3. In Android Studio: Run → app
4. For Play Store: Build → Generate Signed Bundle

### Production Mobile Build
1. Deploy the Next.js app to Vercel (or similar hosting)
2. Set `NEXT_PUBLIC_API_URL=https://your-app.vercel.app` in `.env.local`
3. Update `capacitor.config.ts` - set `server.url` to your deployed URL
4. Run: `npm run build && npx cap copy`
5. Build the native app from Android Studio / Xcode

### Mobile Notes
- `getApiUrl()` from `lib/api-config.ts` resolves API calls based on `NEXT_PUBLIC_API_URL`
- Session cookies work when served from the same origin (localhost or deployed URL)
- For production, deploy the full Next.js app so API routes work as serverless functions
- PWA support: installable from mobile browser (Add to Home Screen)
- Icons: `/public/icon-192.svg`, `/public/icon-512.svg` (update for App Store/Play Store)

## Architecture
- **Client pages** (`/app/**`) call API routes via `fetch(getApiUrl("/api/..."))`
- **API routes** (`/app/api/**`) handle server-side logic (Supabase, mock DB, LLM)
- **Session** uses cookies (works on same-origin; for Capacitor, deploy to Vercel)
- **Mock DB** stores data in `.mock-data.json` when Supabase is not configured

## Key Design Decisions
- All pages use a reusable `GradientBackground` component for consistent hero styling
- Shared `Header` (sticky nav + theme toggle) and `Footer` components
- Glassmorphism design pattern throughout (`.glass-card` utilities)
- Theme supports light/dark/system modes with smooth CSS transitions
- All UI components live in `/components/ui/` following Radix UI patterns
