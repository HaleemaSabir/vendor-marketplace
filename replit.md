# ServiceHub Marketplace

A full-stack multi-vendor service marketplace (similar to Fiverr/Upwork) with three roles: Customer, Provider, and Admin.

## Run & Operate

- `pnpm --filter @workspace/servicehub run dev` — run the frontend (port 26115, path `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, path `/api`)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + shadcn/ui + react-router-dom v7 + Axios
- **Backend:** Express 5 + Mongoose (MongoDB) + JWT + bcryptjs + Cloudinary + multer
- **Monorepo:** pnpm workspaces, Node.js 24, TypeScript 5.9

## Where things live

- `artifacts/servicehub/` — React frontend (BrowserRouter, AppContext for mock users)
- `artifacts/api-server/` — Express backend with all REST routes
- `artifacts/servicehub/src/data/mockData.ts` — All mock data for demo mode
- `artifacts/servicehub/src/context/AppContext.tsx` — Mock user switcher + dark mode
- `artifacts/servicehub/src/index.css` — Blue theme (primary: HSL 221 83% 53%)

## Architecture decisions

- **Dual mode:** Frontend works standalone with mock data via AppContext; also wires to real API via `src/lib/api.ts` Axios client. No backend needed for demo.
- **Router:** react-router-dom v7 with BrowserRouter (wouter was removed — having both caused duplicate React instances and crashes).
- **Auth:** AppContext holds mock users for demo switching. `src/context/AuthContext.tsx` exists for real JWT auth when backend is connected.
- **Blue theme:** Primary color changed from red (0 72% 51%) to blue (221 83% 53%) per spec.
- **Backend secrets required:** MONGODB_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.

## Product

Three-role marketplace: **Customers** browse/search services, submit project requests, track progress, leave reviews. **Providers** manage services (create/edit/delete), handle incoming requests, track earnings. **Admins** see platform-wide stats, manage all users/services/projects.

## User preferences

- Color theme: Blue, white, dark-gray (NOT red)
- Router: react-router-dom (NOT wouter)
- Mock data for demo mode; Axios for real API calls

## Gotchas

- **Never install wouter alongside react-router-dom** — they both depend on React and cause "Cannot read properties of null (reading 'useRef')" crash due to duplicate React instances.
- API server requires MONGODB_URI to be set; it logs a warning and the seed is skipped gracefully if missing.
- `BrowserRouter basename` must match `import.meta.env.BASE_URL` (set by Vite config) for routing to work in the Replit proxy environment.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Demo accounts (when backend connected): admin@servicehub.com/admin123, provider: carlos@servicehub.com/provider123, customer: james@servicehub.com/customer123
