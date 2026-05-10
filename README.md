# SkillPath Kids Frontend

## 🎯 Project Overview
SkillPath Kids is a **premium, calm‑focused educational web app** for parents and teachers to assess, track, and support early‑child development.  The frontend is a **Next.js 13+** application built with **React**, **TypeScript**, and **Tailwind CSS**.  It communicates with a backend API that returns standardized responses (`{ success, data, message }`).

The UI follows a **guided‑companion** philosophy: progressive disclosure, skeleton loaders, and gentle error handling keep parents from feeling overwhelmed.

---

## ✨ Key Features
- **Parent Dashboard** – Progress cards, daily tips, and worksheet recommendations.
- **Assessment Flow** – Server‑driven questions with a calm, responsive UI.
- **Results & History** – Displays `HistoryResult` from the backend.
- **Tips & Recommendations** – Progressive disclosure of side‑tips, with icon mapping.
- **Worksheet Library** – Free and premium worksheets with graceful download actions.
- **Skeleton Loaders** – Reusable skeleton components for progress, tip, and worksheet cards.
- **Error Boundary** – Global client‑side error handling with a friendly retry UI.
- **Icon Mapper** – Centralised `getIconFromName` that maps backend `iconName` strings to Lucide icons.
- **Type‑Safe API Client** – Handles `success`, `data`, `message` and throws descriptive errors.

---

## 🛠️ Tech Stack
| Layer | Technology |
|------|------------|
| Framework | **Next.js (app router)** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** (custom design tokens, dark mode, glassmorphism) |
| UI Components | Custom component library (`ui/*`) & **Lucide‑React** icons |
| State Management | React hooks & server actions |
| Data fetching | `fetch` with `no‑store` cache, `apiClient` wrapper |
| Build tool | **Vite** (via Next.js) |
| Testing | (not configured yet) |

---

## 🚀 Getting Started
### Prerequisites
- **Node.js** >= 18
- **pnpm** (or npm/yarn) – the repo uses the default npm scripts.
- A running backend API (see `.env.local.example`).

### Installation
```bash
# Clone the repo (already done in your workspace)
cd "d:/TIYAN/UNIPMA/Side Jobs/Skill Paths/skillpath-kids/frontend"
# Install dependencies
npm install
```

### Environment variables
Create a `.env.local` file at the project root:
```env
NEXT_PUBLIC_API_URL=https://your-backend.example.com/api
# (any other env vars required by the backend)
```
> **Note:** The project already contains a `.env.local` placeholder.

### Development server
```bash
npm run dev
```
Open `http://localhost:3000` – the app hot‑reloads on file changes.

### Build for production
```bash
npm run build   # creates an optimized static bundle
npm start       # runs the production server
```

---

## 📦 Scripts
| Script | Description |
|--------|-------------|
| `dev` | Starts Next.js in development mode with hot reloading. |
| `build` | Compiles the app for production. |
| `start` | Runs the compiled production server. |
| `lint` | Executes ESLint (if configured). |
| `type-check` | Runs `tsc --noEmit` to verify TypeScript types. |

---

## 📂 Folder Structure (high‑level)
```
frontend/
├─ src/
│  ├─ app/                # Next.js app router (pages)
│  │  └─ (dashboard)/    # Dashboard routes (home, results, tips, files)
│  ├─ components/          # UI primitives (button, card, skeletons, etc.)
│  ├─ features/            # Feature‑based modules
│  │  ├─ assessment/      # Assessment screen + hooks
│  │  ├─ dashboard/       # Dashboard shells, hero, progress, tip, recommendation
│  │  ├─ files/            # Worksheet library
│  │  └─ tips/             # Daily tip screen
│  ├─ lib/                 # API client, icon‑mapper, services
│  ├─ actions/             # Server actions for questions, tips, files
│  ├─ types/               # Shared TypeScript interfaces (AssessmentQuestion, HistoryResult, etc.)
│  └─ data/                # Static fallback data (used only during dev)
├─ public/                 # Static assets (favicon, images)
├─ .env.local              # Local environment variables (not committed)
├─ next.config.js          # Next.js configuration (including experimental app dir)
├─ tailwind.config.js      # Tailwind custom design tokens
└─ package.json            # Dependencies & scripts
```

---

## 🔄 Data Flow & API Conventions
- All API calls go through `src/lib/api-client.ts`. The client expects a response shape:
  ```json
  { "success": true, "data": <payload>, "message": "optional" }
  ```
  Errors are thrown with the `message` field when `success` is `false`.
- **Icon mapping** – Backend sends `iconName: string`. The utility `src/lib/icon-mapper.ts` resolves it to a Lucide component, falling back to `ClipboardCheck`.
- **Progress & History** – Dashboard fetches `/results/history?limit=1` and renders `DashboardProgress`. Skeletons are shown while loading.
- **Error Boundary** – Wraps each top‑level route (`/(dashboard)/assessment`, `/results`, `/tips`, `/files`). On network/API failure a calm message appears with a “Coba Lagi” button that retries the component.

---

## 🎨 UI/UX Details
- **Skeleton loaders** (`src/components/ui/skeletons.tsx`) match the exact shapes of their content cards and are used via React `Suspense`.
- **Progressive disclosure** – Tips screen shows three side‑tips and a “Lihat Lainnya” button that expands the list.
- **Calm color palette** – Tailwind custom colors, soft shadows, and generous spacing provide a stress‑free experience.
- **ARIA live regions** – Loading states, error messages, and analyzing feedback use `aria-live="polite"` for screen‑reader accessibility.

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/your-feature`).
3. Install dependencies and run the dev server.
4. Follow the existing code style (Prettier + ESLint).  All new UI components should use the design system in `src/components/ui/`.
5. Open a Pull Request with a clear description of the change.

---

## 📄 License
This project is **private** and intended for internal use by the SkillPath Kids team.  If you plan to open‑source it, replace this section with the appropriate license.

---

*Generated by Antigravity – your AI‑powered code‑assistant.*
