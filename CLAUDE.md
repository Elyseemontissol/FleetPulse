# FleetPulse

Cloud-based fleet management SaaS platform built for Brookhaven Science Associates (BSA).

## Tech Stack
- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: NestJS (TypeScript) - `apps/api/`
- **Web Dashboard**: Next.js 14 (App Router) - `apps/web/`
- **Mobile App**: React Native / Expo - `apps/mobile/`
- **Database**: PostgreSQL via Supabase
- **Shared Types**: `packages/shared/`

## Project Structure
```
apps/api/          NestJS API server (port 3001)
apps/web/          Next.js web dashboard (port 3000)
apps/mobile/       React Native / Expo mobile app
packages/shared/   Shared TypeScript types + Zod validators
supabase/          Database migrations and RLS policies
infra/             Docker, Terraform configs
```

## Key Commands
```bash
pnpm install       # Install all dependencies
pnpm dev           # Start all apps in dev mode
pnpm build         # Build all packages
pnpm type-check    # TypeScript type checking
```

## Database
- Schema in `supabase/migrations/001_initial_schema.sql`
- RLS policies in `supabase/migrations/002_rls_policies.sql`
- Seed data in `supabase/migrations/003_seed_data.sql`

## API Modules
- Auth, Assets, Work Orders, Inspections, Maintenance, Fuel, Telematics, Reports
- All endpoints require JWT auth (Supabase)
- Role-based access: admin, fleet_manager, shop_supervisor, mechanic, driver, viewer
