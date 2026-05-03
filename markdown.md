# Tiny House Laos Project Handoff

## Project Summary

- Project name: `Tiny House Laos`
- Domain: rental platform for rooms, apartments, and houses in Laos
- Goal: production-ready full-stack platform
- Current repository root:
  - `frontend/`
  - `backend/`
  - `markdown.md`

This file is the main handoff note for a new AI agent or a new session. It should be read first before making changes.

## Current State

### Frontend

- Status: implemented
- Stack: Next.js 14 App Router + TypeScript + Tailwind CSS
- Purpose: public browsing UI and landlord/user dashboard UI
- Theme: blue/cyan SaaS-style design system
- Current data mode: backend-first with mock fallback for public listing views
- Real backend integration: partially connected
- Real auth integration: connected

### Backend

- Status: implemented and compiles
- Stack: Node.js + Express + TypeScript + Prisma + PostgreSQL + JWT + Cloudinary + Zod
- Purpose: real production backend for auth, listings, uploads, bookings, favorites, contacts, and admin moderation
- Build status: `npm run build` passes
- DB migration status: not run yet in this repo session because real PostgreSQL was not configured here
- Cloudinary status: code is ready, but real credentials are still placeholders in `.env`

## What Was Removed

The old static reference/template folders were deleted from the root because the working app now lives in `frontend/`:

- `homepage_tiny_house`
- `homepage_tiny_house_blue`
- `lao_living_modern`
- `list_your_property_tiny_house`
- `list_your_property_tiny_house_blue`
- `login_register_tiny_house`
- `login_register_tiny_house_blue`
- `property_details_tiny_house`
- `property_details_tiny_house_blue`
- `search_results_tiny_house_1`
- `search_results_tiny_house_2`
- `search_results_tiny_house_blue`
- `user_center_tiny_house`
- `user_center_tiny_house_blue`

Important:
- Do not assume those folders still exist.
- The only active app code is now in `frontend/` and `backend/`.

## Repo Structure

```text
stitch_tiny_house_laos_portal/
├── .claude/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.ts
│   │   │   ├── env.ts
│   │   │   └── prisma.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error-handler.middleware.ts
│   │   │   ├── not-found.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── booking/
│   │   │   ├── contact/
│   │   │   ├── favorite/
│   │   │   ├── listing/
│   │   │   ├── upload/
│   │   │   └── user/
│   │   ├── types/
│   │   │   ├── express/
│   │   │   └── streamifier.d.ts
│   │   ├── utils/
│   │   │   ├── api-error.ts
│   │   │   ├── async-handler.ts
│   │   │   ├── cookies.ts
│   │   │   ├── jwt.ts
│   │   │   ├── pagination.ts
│   │   │   ├── password.ts
│   │   │   └── slug.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── Makefile
│   ├── next-env.d.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
└── markdown.md
```

## Frontend Details

### Frontend Routes

- `/`
  - Home page
  - Uses hero, categories, recommended listings, city cards, and a mock map preview

- `/listings`
  - Search results page
  - Reads backend data first
  - Supports search params, mobile filter drawer, and fallback data if API is unavailable

- `/listings/[id]`
  - Listing detail page
  - Reads backend data first
  - Falls back to `frontend/data/listings.ts` only when the API is unavailable
  - Example fallback path: `/listings/vientiane-villa-riverside`

- `/login`
  - Real sign in / sign up page
  - Uses backend auth API
  - Supports redirect query parameter after auth

- `/dashboard`
  - Protected route
  - Requires authenticated user
  - Reads landlord listings from backend when available

- `/post-property`
  - Protected route
  - Redirects to login when unauthenticated
  - Shows landlord-required message for `USER` role
  - Uploads images first, then creates listing through backend API

### Frontend Navigation Flow

- Navbar -> Home
- Navbar -> Listings
- Navbar -> Login when logged out
- Navbar -> Dashboard, Logout, user name when logged in
- Navbar -> Post Property
- Home search -> Listings
- Listing card -> Listing detail
- Login or Register -> Dashboard
- Dashboard -> Post Property

### Frontend Main Files

- `frontend/app/layout.tsx`
  - Global layout
  - Loads fonts
  - Applies navbar/footer to all pages
  - Wraps the app in `AuthProvider`

- `frontend/app/globals.css`
  - Global styling
  - Shared utility class patterns such as `.page-shell`, `.card-surface`, `.section-title`
  - Also contains root theme tokens and horizontal overflow protection

- `frontend/components/layout/Navbar.tsx`
  - Top nav
  - Mobile menu
  - Mock language toggle button
  - Active state uses blue highlight
  - Reads auth state from `AuthProvider`

- `frontend/components/layout/Footer.tsx`
  - Footer links and contact summary

- `frontend/components/auth/LoginForm.tsx`
  - Real sign in and sign up form
  - Handles validation, loading, and auth errors

- `frontend/components/listings/*`
  - Listing cards, gallery, filter sidebar, detail actions, search bar
  - Listings UI is now backend-aware and mobile-filter aware

- `frontend/components/auth/AuthProvider.tsx`
  - Stores authenticated user and in-memory access token
  - Restores session with refresh cookie

- `frontend/components/auth/RequireAuth.tsx`
  - Client-side route guard for protected pages

- `frontend/components/home/*`
  - Home page sections

- `frontend/data/listings.ts`
  - Mock listing source
  - Used only as fallback now

- `frontend/services/api.ts`
  - Shared fetch wrapper with `credentials: "include"`

- `frontend/services/auth.ts`
  - Auth API client for register, login, refresh, me, logout

- `frontend/services/listings.ts`
  - Listing API client
  - Normalizes backend listing payloads into the frontend card/detail shape

- `frontend/services/user.ts`
  - Profile update helper used by the post-property flow

### Frontend Design System

Current frontend theme is blue/cyan, not orange anymore.

Main tokens:

- `primary`: `#2563EB`
- `primary-light`: `#3B82F6`
- `primary-dark`: `#1E40AF`
- `accent`: `#06B6D4`
- `page background`: `#F8FAFC`
- `card background`: `#FFFFFF`
- `text primary`: `#0F172A`
- `text secondary`: `#64748B`

Important:

- The old orange theme was intentionally replaced
- Primary buttons now use a blue -> cyan gradient
- Focus rings, active nav state, badges, price text, and glows were updated to the blue system
- If a future agent sees orange in the UI again, treat that as a regression bug

### Frontend Data Shape

Each mock listing contains:

- `id`
- `title`
- `city`
- `district`
- `village`
- `address`
- `price`
- `deposit`
- `type`
- `rating`
- `distance`
- `status`
- `images`
- `amenities`
- `landlord`
- `contact`
- `description`

### Frontend Test Status

Verified in the latest integration pass:

- `npm run build` passed after auth integration and listing/post-property wiring
- Public listing views now try backend first and fall back cleanly
- Protected pages are guarded by auth state in the frontend
- Global overflow protections were added to reduce horizontal scrolling on mobile

Known frontend limitation:

- `npm run lint` was not initialized yet because `next lint` prompted for ESLint setup interactively

## Backend Details

### Backend Summary

Backend was built to support real production flows, not just CRUD demo endpoints.

Implemented modules:

- `auth`
- `user`
- `listing`
- `upload`
- `booking`
- `favorite`
- `contact`
- `admin`

### Backend API Prefix

All backend routes are mounted under:

- `/api/auth`
- `/api/users`
- `/api/upload`
- `/api/listings`
- `/api/favorites`
- `/api/bookings`
- `/api/contacts`
- `/api/admin`

Health endpoint:

- `GET /health`

Important auth/listing compatibility routes added in the latest pass:

- `GET /api/auth/me`
- `GET /api/listings/amenities`

### Backend Auth Design

- Access token: JWT
- Refresh token: JWT
- Refresh token is also stored hashed in DB
- Refresh token cookie helpers exist in `src/utils/cookies.ts`
- Password hashing uses `bcryptjs`
- Public login now accepts either email or phone as the identifier
- Roles:
  - `USER`
  - `LANDLORD`
  - `ADMIN`

### Backend Listing Design

Listing supports:

- creation by landlord/admin
- multiple images
- amenities relation
- availability status
- approval status
- landlord ownership
- soft delete
- keyword search
- city filter
- district filter
- price range filter
- amenities filter
- amenity lookup endpoint for frontend selection
- sort by:
  - `price_asc`
  - `newest`
  - `rating`

### Backend Upload Design

- Uses `multer` memory storage
- Uses Cloudinary upload stream
- Accepts multiple files
- Can optionally attach uploaded images directly to an existing listing using `listingId`

### Backend Booking Design

- Only `USER` can create booking requests
- `LANDLORD` or `ADMIN` can update booking status
- Booking statuses:
  - `PENDING`
  - `ACCEPTED`
  - `REJECTED`

### Backend Favorite Design

- User can save listing
- User can remove saved listing
- User can fetch saved listings

### Backend Contact Design

- Stores landlord contact intent
- Stores:
  - `userId`
  - `listingId`
  - `message`
  - `createdAt`

### Backend Admin Design

- Approve listing
- Soft-delete listing
- Ban user

## Backend Prisma Schema

Main models:

- `User`
- `Listing`
- `ListingImage`
- `Amenity`
- `ListingAmenity`
- `Favorite`
- `Booking`
- `Contact`

Main enums:

- `Role`
- `UserStatus`
- `ListingType`
- `ListingAvailabilityStatus`
- `ListingApprovalStatus`
- `BookingStatus`

Main relations:

- User 1:N Listing
- Listing 1:N ListingImage
- Listing M:N Amenity via `ListingAmenity`
- User 1:N Favorite
- User 1:N Booking
- Listing 1:N Booking
- User 1:N Contact
- Listing 1:N Contact

Important schema files:

- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`

### Seed Data

Seed exists for amenities and should be run after migrate:

- Wi-Fi
- Parking
- Air Conditioning
- Furnished
- Laundry
- Pet Friendly
- Security
- Balcony
- Kitchen
- Water Heater
- Garden
- Pool

## Backend Main Files To Know

### App Bootstrap

- `backend/src/app.ts`
  - Express app setup
  - Security middleware
  - route mounting
  - health check
  - error handling

- `backend/src/server.ts`
  - HTTP startup
  - graceful shutdown

### Config

- `backend/src/config/env.ts`
  - validates all env vars with Zod

- `backend/src/config/prisma.ts`
  - Prisma client instance

- `backend/src/config/cloudinary.ts`
  - Cloudinary setup

### Middleware

- `backend/src/middlewares/auth.middleware.ts`
  - Bearer token auth
  - role authorization

- `backend/src/middlewares/validate.middleware.ts`
  - request body validation
  - request query validation

- `backend/src/middlewares/error-handler.middleware.ts`
  - centralized API error handling

- `backend/src/middlewares/not-found.middleware.ts`
  - fallback for unknown route

### Core Service Files

- `backend/src/modules/auth/auth.service.ts`
- `backend/src/modules/listing/listing.service.ts`
- `backend/src/modules/upload/upload.service.ts`
- `backend/src/modules/booking/booking.service.ts`
- `backend/src/modules/favorite/favorite.service.ts`
- `backend/src/modules/contact/contact.service.ts`
- `backend/src/modules/admin/admin.service.ts`

These files contain the main business logic and should be the first place to inspect when changing behavior.

## Environment Variables

Sample file exists at:

- `backend/.env`

Current required env keys:

- `NODE_ENV`
- `PORT`
- `CLIENT_ORIGIN`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Important:

- The current `.env` values are placeholders
- Real PostgreSQL and Cloudinary credentials must be set before functional API testing

## Run Commands

### Frontend

Run inside `frontend/`:

```bash
npm install
npm run dev
npm run build
```

Open:

```text
http://localhost:3000
```

### Backend

Run inside `backend/`:

```bash
npm install
npm run prisma:generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/health
```

## Verified Status

### Verified in this repo session

- Frontend build passes
- Frontend auth provider and protected routes compile successfully
- Frontend listing pages compile with backend-first data loading and fallback logic
- Backend `npm install` passes
- Backend `npm run prisma:generate` passes
- Backend `npm run build` passes

### Not fully verified yet

Because real infrastructure was not configured in this session:

- Prisma migration against a real local PostgreSQL instance
- Seed execution against a real DB
- Postman end-to-end tests
- Real Cloudinary upload flow
- Browser-level sign-in/sign-up manual testing against a live backend
- Browser-level mobile viewport verification at 320/375/390/414/768 widths

## Current Gaps / Limitations

### Frontend Gaps

- Public listings still rely on fallback mock data when backend is unavailable
- Contact landlord flow is still mock UI on the frontend
- No `app/auth/callback` page
- No ESLint config initialized

### Backend Gaps

- No Swagger/OpenAPI docs yet
- No Postman collection committed yet
- No test suite yet
- No background jobs
- No email/SMS notifications
- No chat system
- No review/rating write flow
- No audit log table
- `approvedById` is stored on `Listing` but not yet modeled as a Prisma relation to `User`

## Important Things To Keep In Mind

- Do not recreate deleted template folders; they are intentionally removed
- Frontend and backend are now partially integrated
- Frontend still keeps the fallback mock shape in `frontend/data/listings.ts`
- Backend listing response shape is richer than frontend mock shape
- Any next AI/session wiring frontend to backend must align these data contracts carefully
- Before doing real upload tests, Cloudinary credentials must be valid
- Before doing real booking/favorite/contact tests, a real database migration must be applied
- Backend CORS `CLIENT_ORIGIN` must match the frontend origin for cookie-based refresh to work
- Refresh token is stored only in the backend httpOnly cookie; frontend stores access token in memory only
- Mobile overflow was addressed globally in `globals.css` and locally in navbar/listings/detail/post/dashboard components

## Recommended Next Steps

### Highest priority

1. Run the backend with real PostgreSQL and Cloudinary credentials
2. Manually verify sign up, sign in, refresh, logout, and protected route behavior in the browser
3. Manually verify listing creation with real image uploads
4. Manually verify mobile widths at `320`, `375`, `390`, `414`, and `768`
5. Add Postman collection or API docs

### Strong next steps

1. Add ESLint to frontend
2. Add backend integration tests
3. Replace mock contact/favorite/dashboard data with real backend endpoints
4. Add `app/auth/callback` if auth UX requires it
5. Add admin UI routes for listing moderation and user banning

## Suggested Handoff Reading Order For New AI

If a new AI/session continues this project, read in this order:

1. `markdown.md`
2. `frontend/app/`
3. `frontend/components/`
4. `backend/prisma/schema.prisma`
5. `backend/src/app.ts`
6. `backend/src/modules/auth/`
7. `backend/src/modules/listing/`
8. `backend/src/modules/upload/`

This order gives enough context to continue safely without confusion.
