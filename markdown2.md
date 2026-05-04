# Tiny House Laos deployment and fix notes

Date: 2026-05-04

## What was fixed

### Local PostgreSQL

- Created a project-local PostgreSQL cluster in `backend/.local-postgres`.
- The local database runs on `localhost:55432`.
- The local database name is `tiny_house_laos`.
- Updated local `backend/.env` to use:

```env
DATABASE_URL=postgresql://postgres@localhost:55432/tiny_house_laos?schema=public
```

- Added helper commands in `backend/package.json`:

```powershell
npm.cmd run db:local:start
npm.cmd run db:local:status
npm.cmd run db:local:stop
```

- Added scripts:
  - `backend/scripts/start-local-postgres.ps1`
  - `backend/scripts/status-local-postgres.ps1`
  - `backend/scripts/stop-local-postgres.ps1`

### Publish listing internal server error

The publish form was failing with `Internal server error` when the deposit was too large, for example:

```text
999999999999999999
```

The database stores `price` and `deposit` as:

```prisma
Decimal(12, 2)
```

So the maximum safe amount is:

```text
9999999999.99
```

Fixes:

- Backend now validates `price` and `deposit` before Prisma writes to PostgreSQL.
- Frontend now blocks too-large price/deposit before upload/publish.
- Frontend API helper now shows field validation messages like `Deposit is too large` instead of only `Validation failed`.

Files changed:

- `backend/src/modules/listing/listing.validation.ts`
- `frontend/app/post-property/page.tsx`
- `frontend/services/api.ts`

### Publish response shape

The backend `createListing` response did not include `landlord`, but the frontend expected:

```ts
listing.landlord.fullName
```

Fix:

- `createListing` and `updateListing` now include landlord data in the response.

File changed:

- `backend/src/modules/listing/listing.service.ts`

### Uploaded photos not showing

Uploads worked, and files were saved under:

```text
backend/uploads/listings
```

But the browser could not display them from the frontend because the backend returned:

```http
Cross-Origin-Resource-Policy: same-origin
```

Frontend runs on `localhost:3000`, while backend images are served from `localhost:4000`, so the browser blocked the images.

Fix:

- `/uploads` static files now return:

```http
Cross-Origin-Resource-Policy: cross-origin
```

File changed:

- `backend/src/app.ts`

## Local run commands

Start PostgreSQL:

```powershell
cd backend
npm.cmd run db:local:start
```

Start backend:

```powershell
cd backend
npm.cmd run dev
```

Start frontend:

```powershell
cd frontend
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/health
```

## Verified locally

- Backend build passes.
- Frontend build passes.
- Local PostgreSQL works.
- Register user works.
- Upload image works.
- Publish listing works.
- Uploaded photos display after the `/uploads` header fix.
- Listing detail page opens after publish.

## GitHub update

Repository remote:

```text
https://github.com/Tonyssp/Tinyhome1.git
```

Branch:

```text
main
```

Pushed commit:

```text
f1a89e2 Fix listing publish and document deployment
```

Recommended files to commit:

```text
.gitignore
backend/package.json
backend/scripts/start-local-postgres.ps1
backend/scripts/status-local-postgres.ps1
backend/scripts/stop-local-postgres.ps1
backend/src/app.ts
backend/src/modules/listing/listing.service.ts
backend/src/modules/listing/listing.validation.ts
frontend/app/post-property/page.tsx
frontend/services/api.ts
markdown2.md
```

Do not commit generated local files:

```text
backend/.local-postgres/
backend/uploads/
frontend/.next/
backend/dist/
```

## Railway backend setup

Use Railway for:

- Express backend
- PostgreSQL production database

Railway service setup:

1. Create a new Railway project.
2. Add a PostgreSQL database.
3. Add a backend service from the GitHub repository.
4. Set the service root directory to:

```text
backend
```

5. Set build command:

```text
npm install && npm run prisma:generate && npm run build
```

6. Set start command:

```text
npm run prisma:push && npm run start
```

Production backend environment variables:

```env
NODE_ENV=production
PORT=4000
CLIENT_ORIGIN=https://YOUR-VERCEL-DOMAIN.vercel.app
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_ACCESS_SECRET=replace-with-strong-32-plus-character-secret
JWT_REFRESH_SECRET=replace-with-another-strong-32-plus-character-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Important:

- Railway should use its own PostgreSQL `DATABASE_URL`, not the local `localhost:55432` database.
- If Cloudinary credentials are real, uploads go to Cloudinary.
- If Cloudinary credentials are placeholders, backend falls back to local file upload. Local file upload may not persist reliably on Railway, so production should use real Cloudinary credentials.

## Vercel frontend setup

Use Vercel for:

- Next.js frontend

Vercel project setup:

1. Import the GitHub repository.
2. Set root directory to:

```text
frontend
```

3. Set build command:

```text
npm run build
```

4. Set output/framework:

```text
Next.js
```

Production frontend environment variable:

```env
NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN.up.railway.app/api
```

After Vercel gives a domain, update Railway backend:

```env
CLIENT_ORIGIN=https://YOUR-VERCEL-DOMAIN.vercel.app
```

## Deploy order

1. Push code to GitHub.
2. Deploy backend on Railway.
3. Copy Railway backend domain.
4. Set Vercel `NEXT_PUBLIC_API_URL` to Railway backend `/api`.
5. Deploy frontend on Vercel.
6. Copy Vercel domain.
7. Set Railway `CLIENT_ORIGIN` to the Vercel domain.
8. Redeploy Railway backend.
9. Test:

```text
GET https://YOUR-RAILWAY-BACKEND-DOMAIN.up.railway.app/health
```

Then test from Vercel:

- register
- login
- upload image
- publish listing
- open listing detail page

## Tools not installed on this machine

These commands are currently not installed in the terminal:

```text
gh
vercel
railway
```

Because of that, direct CLI deployment cannot be completed from this terminal until those tools are installed and logged in.

If deploying from dashboards, GitHub + Vercel + Railway can still work without these CLIs.
