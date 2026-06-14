# Abish's Portfolio

A terminal-themed developer portfolio built with React, TypeScript, and Supabase — featuring a full admin dashboard for managing projects, skills, and contact messages.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white&style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white&style=flat-square)

## Features

- **Terminal UI** — boot screen, typing effects, neon-styled components
- **Dynamic content** — projects, skills, and bio pulled live from Supabase
- **Admin dashboard** — protected routes to create, edit, and delete projects, skills, and messages
- **CV modal** — view and download resume directly from the hero section
- **Contact form** — submissions stored in Supabase, visible in the admin panel
- **Responsive** — mobile-first layout across all pages

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Supabase (Auth, Database, Storage) |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query v5 |
| Deployment | Vercel |

## Project Structure

```
src/
├── components/
│   ├── admin/        # Protected route wrapper + admin layout
│   ├── layout/       # Navigation, footer, main layout
│   ├── sections/     # BootScreen
│   ├── terminal/     # Reusable terminal-themed UI components
│   └── ui/           # shadcn/ui primitives
├── data/             # Static fallback data
├── hooks/            # Custom React hooks (auth, scroll reveal, toast)
├── integrations/     # Supabase client & generated types
├── lib/              # Utility functions
└── pages/
    ├── admin/        # Dashboard, projects, skills, messages, settings
    ├── About.tsx
    ├── Contact.tsx
    ├── Home.tsx
    ├── Projects.tsx
    └── Skills.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Abishabr/POrtfolio.git
cd POrtfolio

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in your Supabase URL and anon key

# 4. Start dev server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

> Both values are found in your Supabase project under **Settings → API**.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |

## License

MIT
