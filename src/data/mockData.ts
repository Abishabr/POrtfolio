/**
 * Mock data — used only to seed Supabase via the SQL editor.
 * The frontend no longer reads from this file directly.
 * Run the SQL below in your Supabase SQL editor to populate the database.
 */

// ─── SKILLS ──────────────────────────────────────────────────────────────────
export const mockSkills = [
  // Frontend
  { name: "React",        category: "frontend", proficiency: 80, display_order: 1 },
  { name: "JavaScript",   category: "frontend", proficiency: 85, display_order: 2 },
  { name: "HTML5 / CSS3", category: "frontend", proficiency: 90, display_order: 3 },
  // Backend
  { name: "Node.js",      category: "backend",  proficiency: 78, display_order: 4 },
  { name: "Express",      category: "backend",  proficiency: 75, display_order: 5 },
  { name: "REST APIs",    category: "backend",  proficiency: 80, display_order: 6 },
  // Database
  { name: "PostgreSQL",   category: "database", proficiency: 75, display_order: 7 },
  { name: "MySQL",        category: "database", proficiency: 75, display_order: 8 },
  // Tools
  { name: "Git / GitHub", category: "tools",    proficiency: 80, display_order: 9 },
  { name: "VS Code",      category: "tools",    proficiency: 90, display_order: 10 },
];

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
export const mockProjects = [
  {
    name: "HUTMC Website",
    description: "Official website for Haramaya University Technology and Management Club.",
    status: "running",
    tech: ["React", "Node.js", "PostgreSQL"],
    github_url: null,
    live_url: null,
    image_url: null,
    featured: true,
    display_order: 1,
  },
  {
    name: "E-Commerce Dashboard",
    description: "Full-stack e-commerce admin dashboard with real-time analytics.",
    status: "completed",
    tech: ["React", "Node.js", "PostgreSQL"],
    github_url: null,
    live_url: null,
    image_url: null,
    featured: true,
    display_order: 2,
  },
  {
    name: "Real-Time Chat App",
    description: "WebSocket-based chat application with rooms and presence indicators.",
    status: "running",
    tech: ["Socket.io", "MongoDB", "Express"],
    github_url: null,
    live_url: null,
    image_url: null,
    featured: true,
    display_order: 3,
  },
  {
    name: "AI Code Assistant",
    description: "VS Code extension that suggests code completions using a local LLM.",
    status: "completed",
    tech: ["TypeScript", "Python", "OpenAI"],
    github_url: null,
    live_url: null,
    image_url: null,
    featured: false,
    display_order: 4,
  },
  {
    name: "Crypto Portfolio Tracker",
    description: "Track crypto holdings with live price feeds and portfolio analytics.",
    status: "completed",
    tech: ["React", "Web3.js", "GraphQL"],
    github_url: null,
    live_url: null,
    image_url: null,
    featured: false,
    display_order: 5,
  },
  {
    name: "Task Manager Pro",
    description: "Kanban-style task manager with drag-and-drop and team collaboration.",
    status: "completed",
    tech: ["React", "Node.js", "MySQL"],
    github_url: null,
    live_url: null,
    image_url: null,
    featured: false,
    display_order: 6,
  },
];

/*
──────────────────────────────────────────────────────────────────────────────
SQL TO SEED SUPABASE — paste into the SQL editor to populate the database
──────────────────────────────────────────────────────────────────────────────

insert into skills (name, category, proficiency, display_order) values
  ('React',        'frontend', 80, 1),
  ('JavaScript',   'frontend', 85, 2),
  ('HTML5 / CSS3', 'frontend', 90, 3),
  ('Node.js',      'backend',  78, 4),
  ('Express',      'backend',  75, 5),
  ('REST APIs',    'backend',  80, 6),
  ('PostgreSQL',   'database', 75, 7),
  ('MySQL',        'database', 75, 8),
  ('Git / GitHub', 'tools',    80, 9),
  ('VS Code',      'tools',    90, 10);

insert into projects (name, description, status, tech, featured, display_order) values
  ('HUTMC Website',          'Official website for Haramaya University Technology and Management Club.', 'running',   array['React','Node.js','PostgreSQL'],  true,  1),
  ('E-Commerce Dashboard',   'Full-stack e-commerce admin dashboard with real-time analytics.',          'completed', array['React','Node.js','PostgreSQL'],  true,  2),
  ('Real-Time Chat App',     'WebSocket-based chat application with rooms and presence indicators.',     'running',   array['Socket.io','MongoDB','Express'], true,  3),
  ('AI Code Assistant',      'VS Code extension that suggests code completions using a local LLM.',     'completed', array['TypeScript','Python','OpenAI'],  false, 4),
  ('Crypto Portfolio Tracker','Track crypto holdings with live price feeds and portfolio analytics.',   'completed', array['React','Web3.js','GraphQL'],     false, 5),
  ('Task Manager Pro',       'Kanban-style task manager with drag-and-drop and team collaboration.',    'completed', array['React','Node.js','MySQL'],        false, 6);
*/
