# 🎓 Curriculum AI

**Curriculum AI** is a powerful, full-stack AI-powered course builder that transforms any topic into a complete, structured learning experience. Enter a subject and watch as AI generates a detailed curriculum, chapter-by-chapter explanations with code examples, and automatically embeds the most relevant YouTube tutorials — all in minutes.

Built with a premium dark UI inspired by **Spotify** and **HackerRank**, Curriculum AI delivers an immersive, modern experience from start to finish.

---

## ✨ Key Features

- **🪄 AI-Powered Course Generation** — Input a topic, and Google Gemini AI creates a structured syllabus with chapters, descriptions, and estimated durations.
- **🎥 Automated YouTube Integration** — Every chapter is enriched with the most relevant YouTube tutorial, fetched automatically via the YouTube Data API v3.
- **📝 Inline Chapter Editing** — Edit chapter names, descriptions, and course titles directly from the UI using optimistic updates.
- **🖼️ Custom Course Banners** — Upload and manage course images via Cloudinary with a seamless drag-and-drop experience.
- **📊 Interactive Dashboard** — View, manage, and delete your generated courses from a sleek, dark-themed dashboard.
- **✅ Chapter Progress Tracking** — Mark chapters as completed and track your progression via a real-time, animated Spotify-green progress bar. Built with full-stack server actions and Drizzle ORM.
- **📄 Export to Markdown** — Download your entire course for offline viewing. Instantly compiles explanations and code blocks into a `.md` file utilizing native browser Blob APIs.
- **🌍 Explore Community Courses** — Browse courses created by other users with paginated explore functionality.
- **🔐 Secure Authentication** — Sign up, sign in, and manage sessions powered by Clerk.
- **💎 Upgrade Plans** — Three-tier pricing page (Weekly ₹99, Monthly ₹499, Yearly ₹1,999) for premium access.
- **🚀 Blazing Fast** — Built on Next.js 16 with Turbopack and Server Actions for highly optimized, secure database operations.

---

## 🎨 Design & UX

Curriculum AI features a **premium dark theme** with:
- Glassmorphism cards with subtle borders and backdrop blur
- Violet-cyan gradient accents and animated elements
- Micro-animations (fade-in, hover-lift, shimmer skeletons)
- Spotify-style sidebar navigation with active indicators
- HackerRank-inspired chapter progression and code display
- Custom CSS text-gradient logo (no image dependencies)
- Responsive design from mobile to desktop

---

## 🛠️ Tech Stack & Dependencies

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

### Third-Party APIs & Services
| Service | Purpose |
|---|---|
| [Clerk](https://clerk.com/) | Authentication & user management |
| [Google Gemini AI](https://ai.google.dev/) | Course content generation (gemini-3-flash) |
| [YouTube Data API v3](https://developers.google.com/youtube/v3) | Video search & embedding |
| [Cloudinary](https://cloudinary.com/) | Course banner image hosting |

### Major Dependencies
```
@clerk/nextjs ^7.3.7       @google/genai ^2.6.0
drizzle-orm ^0.45.2         @neondatabase/serverless ^1.1.0
next ^16.2.6                react ^19.2.4
tailwindcss ^4.3.0          react-youtube ^10.1.0
next-cloudinary ^6.17.5     axios ^1.16.1
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** v18.17.0 or higher
- **npm**, yarn, or pnpm
- A PostgreSQL database (recommend [Neon](https://neon.tech/))

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-course-builder.git
cd ai-course-builder
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
# ──────────────────────────────────────────────
GEMINI_API_KEY=AIzaSy...
```

> **Note**: The `GEMINI_API_KEY` is server-only (no `NEXT_PUBLIC_` prefix) for security.

### 4. Database Setup & Migrations
```bash
# Generate migration files from your schema
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
│   ├── course/[courseId]/     # Public course viewer
│   │   └── start/            # Interactive chapter reader
│   ├── create-course/        # Multi-step course creation flow
│   │   └── [courseId]/       # Course layout editor & finish page
│   ├── dashboard/            # User dashboard (sidebar layout)
│   │   ├── _components/      # SideBar, Header, CourseCard, etc.
│   │   ├── explore/          # Explore community courses
│   │   └── upgrade/          # Pricing plans page
│   ├── globals.css           # Design system & dark theme
│   ├── layout.js             # Root layout with Clerk & fonts
│   └── page.js               # Landing page
│
├── components/ui/            # Shadcn UI components
├── configs/
│   ├── AiModel.jsx           # Google Gemini AI integration
│   ├── action.js             # Server Actions (database CRUD)
│   ├── db.jsx                # Drizzle database connection
│   ├── schema.jsx            # PostgreSQL table schemas
│   └── service.jsx           # YouTube API service
│
├── middleware.js              # Clerk route protection
├── tailwind.config.js         # Tailwind CSS configuration
└── next.config.mjs            # Next.js & Turbopack config
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
