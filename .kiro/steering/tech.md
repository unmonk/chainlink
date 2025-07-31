# Technology Stack

## Core Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Primary language for type safety
- **Convex** - Backend-as-a-Service for real-time data and serverless functions

## Frontend Stack
- **React 18** - UI library with hooks and modern patterns
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library built on Radix UI primitives
- **Framer Motion** - Animation library
- **Zustand** - State management

## Authentication & User Management
- **Clerk** - Authentication and user management service

## Styling & UI
- **Radix UI** - Headless UI components for accessibility
- **Lucide React** - Icon library
- **Class Variance Authority (CVA)** - Component variant management
- **Tailwind Animate** - CSS animations

## Data & Forms
- **React Hook Form** - Form handling with Zod validation
- **TanStack Table** - Data table management
- **Recharts** - Chart and data visualization

## Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Sentry** - Error monitoring and performance tracking

## PWA & Service Worker
- **Serwist** - Service worker management for PWA functionality

## Common Commands

### Development
```bash
npm run dev          # Start development servers (Convex + Next.js)
npm run dev:server   # Start Convex backend only
npm run dev:client   # Start Next.js frontend only
```

### Build & Deploy
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run deploy       # Deploy Convex backend
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## Architecture Notes
- Uses Convex for real-time backend with automatic schema validation
- Implements PWA patterns with service workers
- Dark mode support with next-themes
- Component-driven architecture with reusable UI primitives
- Type-safe API calls through Convex client