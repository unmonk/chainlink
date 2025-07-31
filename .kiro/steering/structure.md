# Project Structure

## Root Directory Organization

### Application Code
- **`app/`** - Next.js App Router pages and layouts
  - Route groups: `(account)`, `(game)` for logical organization
  - `api/` - API routes and server-side logic
  - `auth.ts` - Authentication configuration
  - `globals.css` - Global styles and CSS variables

### Components
- **`components/`** - React components organized by feature
  - Feature-based folders: `auth/`, `dashboard/`, `leaderboards/`, etc.
  - `ui/` - Reusable UI components (Shadcn/ui)
  - `magicui/` - Enhanced UI components with animations

### Backend & Data
- **`convex/`** - Convex backend functions and schema
  - `schema.ts` - Database schema definitions
  - Feature modules: `users.ts`, `matchups.ts`, `picks.ts`, etc.
  - `_generated/` - Auto-generated Convex types

### Utilities & Configuration
- **`lib/`** - Shared utilities and configurations
  - `utils.ts` - Common utility functions
  - `auth.ts` - Authentication helpers
- **`hooks/`** - Custom React hooks
- **`public/`** - Static assets (images, icons, manifest)

## Key Conventions

### File Naming
- Use kebab-case for files and folders
- Component files use PascalCase for the component name
- Convex functions use camelCase
- Route groups use parentheses: `(account)`

### Component Organization
- Group components by feature/domain
- Keep UI primitives in `components/ui/`
- Co-locate related components in feature folders

### Import Aliases
- `@/` - Root directory alias
- `@/components` - Components directory
- `@/lib` - Utilities directory
- `@/convex` - Convex functions

### Convex Structure
- One file per major feature/entity
- Schema definitions centralized in `schema.ts`
- Use TypeScript for all Convex functions
- Export types from schema for frontend use

### Styling Approach
- Tailwind CSS for styling
- CSS variables for theming in `globals.css`
- Component variants using CVA
- Dark mode support throughout

## Special Directories
- **`.kiro/`** - Kiro IDE configuration and steering rules
- **`.next/`** - Next.js build output (ignored)
- **`node_modules/`** - Dependencies (ignored)
- **`.git/`** - Git repository data