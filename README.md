# 🎓 Curriculum AI

> **Transform any topic into a complete, structured learning experience — powered by AI.**

Curriculum AI is a full-stack AI-powered course builder. Enter a subject and watch as AI generates a detailed curriculum, chapter-by-chapter explanations with code examples, and automatically embeds the most relevant YouTube tutorials — all in minutes.

Built with a premium dark UI inspired by **Spotify** and **HackerRank**, Curriculum AI delivers an immersive, modern learning experience from start to finish.

🌐 **Live Demo:** [curriculum-ai-nine.vercel.app](https://curriculum-ai-nine.vercel.app)

---

## ✨ Key Features

- 🪄 **AI-Powered Course Generation** — Input a topic, and Google Gemini AI (`gemini-3-flash-preview`) creates a structured syllabus with chapters, descriptions, and estimated durations.
- 🔍 **Semantic Search with KNN** — Find courses by meaning, not just keywords. Powered by Google's `gemini-embedding-001` model and Redis Vector Search (KNN). Searching "how to build a website" will surface "HTML & CSS Fundamentals" even though they share zero words.
- ⚡ **Semantic Caching** — Identical or near-identical course prompts are served from Redis in milliseconds instead of re-generating via the AI, saving time and API costs.
- 🎥 **Automated YouTube Integration** — Every chapter is enriched with the most relevant YouTube tutorial, fetched automatically via the YouTube Data API v3.
- 📝 **Inline Chapter Editing** — Edit chapter names, descriptions, and course titles directly from the UI using optimistic updates.
- 🖼️ **Custom Course Banners** — Upload and manage course images via Cloudinary with a seamless drag-and-drop experience.
- 📊 **Interactive Dashboard** — View, manage, and delete your generated courses from a sleek, dark-themed dashboard.
- ✅ **Chapter Progress Tracking** — Mark chapters as completed and track your progression via a real-time, animated Spotify-green progress bar. Built with full-stack server actions and Drizzle ORM.
- 📄 **Export to Markdown** — Download your entire course for offline viewing. Instantly compiles explanations and code blocks into a `.md` file utilizing native browser Blob APIs.
- 🌍 **Explore Community Courses** — Browse courses created by other users with paginated explore functionality.
- 🔐 **Secure Authentication** — Sign up, sign in, and manage sessions powered by Clerk.
- 🛡️ **Rate Limiting** — Server-side rate limiting (5 requests/min per user) via Redis to prevent API abuse.
- 💎 **Upgrade Plans** — Three-tier pricing page (Weekly ₹99 / Monthly ₹499 / Yearly ₹1,999) for premium access.
- 🚀 **Blazing Fast** — Built on Next.js 16 with Turbopack and Server Actions for highly optimized, secure database operations.

---

## 🧠 Architecture: Semantic Search & Caching

Curriculum AI uses a dual-layer intelligent search and caching system built on **Redis** and **Google Gemini Embeddings**. Here's how it works under the hood:

### How Semantic Search Works

```
User searches "learn Python"
        │
        ▼
┌──────────────────────────┐
│  Gemini Embedding API    │  Converts the query into a 3072-dimensional
│  (gemini-embedding-001)  │  vector (a "GPS coordinate" for meaning)
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Redis Vector Search     │  Performs KNN (K-Nearest Neighbors) to find
│  (FT.SEARCH + KNN)      │  the 6 closest course vectors by cosine distance
└──────────┬───────────────┘
           │
     ┌─────┴─────┐
     │           │
  Found?      Empty?
     │           │
     ▼           ▼
  Return     SQL ILIKE
  results    fallback on
  from DB    course name
             & category
```

**Key idea:** Courses like "Python for Beginners" and "Introductory Guide to Python" have nearly identical vector coordinates even though they share zero keywords — so semantic search finds both.

### How Semantic Caching Works

```
User requests "Java for Beginners" course generation
        │
        ▼
┌──────────────────────────┐
│  Generate embedding for  │
│  the user's prompt       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  KNN search Redis cache  │  Is there a previously generated course
│  (distance < 0.15?)      │  with a nearly identical prompt?
└──────────┬───────────────┘
           │
     ┌─────┴─────┐
     │           │
  Cache HIT   Cache MISS
  (d < 0.15)  (d ≥ 0.15)
     │           │
     ▼           ▼
  Return      Call Gemini AI
  cached      to generate,
  course      then cache the
  instantly   result + vector
```

**Result:** If User A generates a "Beginner Java Course" and User B later asks for "Java for Beginners," the second request is served instantly from cache — no AI call needed.

### Redis Data Architecture

| Redis Key Pattern | Type | Purpose | TTL |
|---|---|---|---|
| `course_cache:{uuid}` | JSON | Semantic cache (embedding + AI response payload) | 7 days |
| `searchable_course:{courseId}` | JSON | Global search index (embedding + courseId) | Permanent |
| `user_courses_dashboard:{email}` | String | Dashboard cache (serialized course list) | 1 hour |
| `rate_limit:generate:{email}` | Counter | Rate limiting (5 req/min) | 60 seconds |
| `idx:courses` | FT Index | Vector index for semantic caching (3072-dim, COSINE) | — |
| `idx:global_search` | FT Index | Vector index for explore search (3072-dim, COSINE) | — |

---

## 🎨 Design & UX

Curriculum AI features a **premium dark theme** with:

- Glassmorphism cards with subtle borders and backdrop blur
- Violet-cyan gradient accents and animated elements
- Micro-animations (fade-in, hover-lift, shimmer skeletons)
- Spotify-style sidebar navigation with active indicators
- HackerRank-inspired chapter progression and code display
- Custom CSS text-gradient logo (no image dependencies)
- Fully responsive design from mobile to desktop

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | App Router, Turbopack, Server Actions |
| [React 19](https://react.dev/) | UI Components |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling & Design System |
| [Shadcn UI](https://ui.shadcn.com/) | Pre-built Radix UI components |
| [React Icons](https://react-icons.github.io/react-icons/) | HeroIcons v2 icon set |
| [React YouTube](https://www.npmjs.com/package/react-youtube) | YouTube video embedding |

### Backend & Database

| Technology | Purpose |
|---|---|
| [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) | Secure API layer (no REST routes) |
| [Drizzle ORM](https://orm.drizzle.team/) | Type-safe PostgreSQL queries |
| [Neon PostgreSQL](https://neon.tech/) | Serverless database provider |
| [Redis](https://redis.io/) + [ioredis](https://github.com/redis/ioredis) | Semantic caching, vector search, rate limiting |

### Third-Party APIs & Services

| Service | Purpose |
|---|---|
| [Clerk](https://clerk.com/) | Authentication & user management |
| [Google Gemini AI](https://ai.google.dev/) | Course generation (`gemini-3-flash-preview`) & embeddings (`gemini-embedding-001`) |
| [YouTube Data API v3](https://developers.google.com/youtube/v3) | Video search & embedding |
| [Cloudinary](https://cloudinary.com/) | Course banner image hosting |

### Major Dependencies

```text
@clerk/nextjs            ^7.3.7
@google/genai            ^2.6.0
drizzle-orm              ^0.45.2
@neondatabase/serverless ^1.1.0
ioredis                  ^5.11.1
next                     ^16.2.6
react                    ^19.2.4
tailwindcss              ^4.3.0
react-youtube            ^10.1.0
next-cloudinary          ^6.17.5
axios                    ^1.16.1
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A PostgreSQL database (Neon, Supabase, or local)
- A Redis instance with **RedisJSON** and **RediSearch** modules (e.g., [Redis Cloud](https://redis.com/try-free/), [Upstash](https://upstash.com/), or local via Docker)
- API keys for Clerk, Cloudinary, YouTube Data API v3, and Google Gemini AI

### 1. Clone the Repository

```bash
git clone https://github.com/Milindp-16/Curriculum-AI.git
cd Curriculum-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ──────────────────────────────────────────────
# DATABASE (PostgreSQL — Neon, Supabase, or local)
# ──────────────────────────────────────────────
NEXT_PUBLIC_DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# ──────────────────────────────────────────────
# REDIS (with RedisJSON + RediSearch modules)
# e.g., Redis Cloud, Upstash, or local Docker
# ──────────────────────────────────────────────
REDIS_URL=redis://default:password@host:port

# ──────────────────────────────────────────────
# CLERK AUTHENTICATION
# Get keys from https://dashboard.clerk.com
# ──────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ──────────────────────────────────────────────
# CLOUDINARY (Image uploads)
# Get keys from https://console.cloudinary.com
# ──────────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ──────────────────────────────────────────────
# YOUTUBE DATA API v3
# Get key from https://console.cloud.google.com
# ──────────────────────────────────────────────
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSy...

# ──────────────────────────────────────────────
# GOOGLE GEMINI AI
# Get key from https://aistudio.google.com
# Note: No NEXT_PUBLIC_ prefix — server-only for security
# ──────────────────────────────────────────────
GEMINI_API_KEY=AIzaSy...
```

### 4. Database Setup & Migrations

```bash
# Push your schema to the database
npm run db:push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📂 Project Structure

```
├── app/
│   ├── (auth)/               # Clerk sign-in & sign-up pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── _components/          # Shared components (Logo, Header, Hero)
│   ├── _context/             # React Context providers
│   ├── _shared/              # Shared data (CategoryList)
│   ├── course/[courseId]/    # Public course viewer
│   │   └── start/            # Interactive chapter reader
│   ├── create-course/        # Multi-step course creation flow
│   │   └── [courseId]/       # Course layout editor & finish page
│   ├── dashboard/            # User dashboard (sidebar layout)
│   │   ├── _components/      # SideBar, Header, CourseCard, etc.
│   │   ├── explore/          # Explore & search community courses
│   │   └── upgrade/          # Pricing plans page
│   ├── globals.css           # Design system & dark theme
│   ├── layout.js             # Root layout with Clerk & fonts
│   └── page.js               # Landing page
│
├── components/ui/            # Shadcn UI components
├── configs/
│   ├── AiModel.jsx           # Gemini AI integration (generation + semantic caching)
│   ├── action.js             # Server Actions (CRUD, search, rate limiting, re-indexing)
│   ├── db.jsx                # Drizzle database connection
│   ├── schema.jsx            # PostgreSQL table schemas (CourseList, Chapters)
│   └── service.jsx           # YouTube API service
│
├── lib/
│   ├── redis.js              # Redis (ioredis) connection singleton
│   └── utils.js              # Utility functions (cn helper)
│
├── middleware.js              # Clerk route protection
├── tailwind.config.js         # Tailwind CSS configuration
└── next.config.mjs            # Next.js & Turbopack config
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).