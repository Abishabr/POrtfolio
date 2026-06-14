<div align="center">

<img src="public/favicon.png" width="80" height="80" style="border-radius: 50%" alt="Abrham Habtamu" />

# Abrham Habtamu — Developer Portfolio

**Full-Stack Web Developer · IT Student @ Haramaya University · Ethiopia**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white&style=flat-square)](https://supabase.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white&style=flat-square)](https://vercel.com)

[Live Demo](https://abishabr.vercel.app) · [GitHub](https://github.com/Abishabr/POrtfolio) · [LinkedIn](https://www.linkedin.com/in/abrham-habtamu-24a329310/)

</div>

---

## Overview

A terminal-themed developer portfolio built with React, TypeScript, and Supabase. The entire UI takes inspiration from a hacker-style terminal — boot screen, neon glow effects, typing animations, and a `ps aux` process list for browsing projects. Content is fully dynamic via Supabase, and a protected admin dashboard lets me manage everything without touching code.

---

## Screenshots

> _Boot screen → hero → projects modal → admin dashboard_

| Home | Projects Modal | Admin Dashboard |
|------|---------------|-----------------|
| Terminal boot screen with typing animation | Glassmorphism fullscreen modal on project click | Protected CRUD dashboard for all content |

---

## Features

- **Terminal UI** — boot screen, `>_` prompt styling, typing effects, neon green/cyan palette, scanline overlays
- **Dynamic content** — projects, skills, and bio fetched live from Supabase with fallback to local assets
- **Fullscreen project modal** — glassmorphism modal with blurred backdrop, smooth scale/fade animation, tech badges, GitHub and Live Demo links
- **Admin dashboard** — protected routes to create, edit, and delete projects, skills, and contact messages
- **CV modal** — view and download resume directly from the hero section
- **Contact form** — submissions stored in Supabase and visible in the admin panel
- **Responsive** — mobile-first layout, works across all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18, TypeScript |
| Build Tool | Vite 5 + SWC |
| Styling | Tailwind CSS 3, shadcn/ui, tailwindcss-animate |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query v5 |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

---

## Project Structure

```
├── public/
│   ├── favicon.png          # Profile avatar used as browser tab icon
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── profile-avatar.png
│   │   └── projects/        # Fallback project images
│   ├── components/
│   │   ├── admin/           # ProtectedRoute, AdminLayout
│   │   ├── layout/          # Navigation, Footer, MainLayout
│   │   ├── sections/        # BootScreen
│   │   ├── terminal/        # Reusable terminal UI (TerminalWindow, NeonButton, TypingText…)
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── CVModal.tsx
│   │   └── ProjectModal.tsx # Fullscreen project detail modal
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   ├── use-scroll-reveal.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/
│   │   └── supabase/        # Client + generated database types
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── admin/           # Dashboard, Projects, Skills, Messages, Settings, ResetPassword
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── vercel.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with `projects`, `skills`, and `messages` tables

### Local Setup

```bash
# 1. Clone
git clone https://github.com/Abishabr/POrtfolio.git
cd POrtfolio

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in your Supabase credentials

# 4. Start dev server (runs on http://localhost:8080)
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Both values are found under **Supabase → Project Settings → API**.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

---

## Deployment

The project is deployed on **Vercel**. The `vercel.json` rewrites all routes to `index.html` for client-side routing.

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

To deploy your own copy:

```bash
npm install -g vercel
vercel --prod
```

---

## Admin Dashboard

The `/admin` route is a protected dashboard backed by Supabase Auth.

| Route | Description |
|---|---|
| `/admin` | Login page |
| `/admin/dashboard` | Overview and stats |
| `/admin/projects` | Create / edit / delete projects |
| `/admin/skills` | Manage skill list and proficiency |
| `/admin/messages` | View contact form submissions |
| `/admin/settings` | Upload CV, manage profile settings |
| `/reset-password` | Password reset flow |

All admin routes are wrapped in `<ProtectedRoute>` — unauthenticated access redirects to `/admin`.

---

## License

MIT © [Abrham Habtamu](https://github.com/Abishabr)
