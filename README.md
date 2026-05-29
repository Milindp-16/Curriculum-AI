# 🚀 AI Course Builder

AI Course Builder is a powerful, full-stack Next.js application that leverages Artificial Intelligence to automatically generate comprehensive learning courses. Users can input a topic, and the application will dynamically create a curriculum, generate detailed chapter explanations, and automatically fetch highly relevant YouTube video tutorials to accompany the text content.

## ✨ Major Features

* **🪄 AI-Powered Course Generation:** Input a topic and let AI generate a structured syllabus, chapter titles, and detailed, multi-paragraph explanations with code snippets.
* **🎥 Automated YouTube Integration:** Automatically searches and embeds the most relevant YouTube tutorials for every single chapter.
* **🔐 Authentication:** Secure user sign-up and login powered by Clerk.
* **🖼️ Image Management:** Seamless course banner uploads and hosting managed through Cloudinary.
* **📊 User Dashboard:** A dedicated space for users to view, manage, and delete their generated courses.
* **⚡ Blazing Fast:** Built on Next.js 16 with Turbopack, utilizing Server Actions for highly optimized, secure database operations.

---

## 🛠️ Tech Stack & Dependencies

**Frontend:**
* [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* [React 18](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/) (Styling)
* [React Icons](https://react-icons.github.io/react-icons/) (UI Icons)
* [React YouTube](https://www.npmjs.com/package/react-youtube) (Video Embedding)

**Backend & Database:**
* [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) (API layer)
* [Drizzle ORM](https://orm.drizzle.team/) (Type-safe database interactions)
* PostgreSQL (Database provider)

**Third-Party APIs & Services:**
* **Authentication:** [Clerk](https://clerk.com/)
* **Image Hosting:** [Cloudinary](https://cloudinary.com/)
* **Video Content:** [YouTube Data API v3](https://developers.google.com/youtube/v3)
* **AI Generation:** Google Gemini / OpenAI (LLM Provider)

---

## ⚙️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.17.0 or higher)
* npm, yarn, or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-course-builder.git
cd ai-course-builder
```


### 2. Install Dependencies
```bash
npm install
```


### 3. Set up Environment Variables
```bash
# Database (PostgreSQL URL from Neon, Supabase, or local)
NEXT_PUBLIC_DATABASE_URL=your_postgresql_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cloudinary (For image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# YouTube Data API v3
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_data_api_key

# AI Provider (Gemini or OpenAI)
NEXT_PUBLIC_AI_API_KEY=your_ai_provider_api_key
```


### 4. Database Setup and Migrations
```bash
# Generate migrations
npm run db:generate

# Push migrations to your database
npm run db:push
```


### 5. Run the Development Server
```bash
npm run dev
```
---

## 📂 Project Structure Overview

```bash
├── app/                  # Next.js App Router pages and layouts
│   ├── dashboard/        # User dashboard and course listings
│   ├── create-course/    # Multi-step course generation flow
│   ├── course/           # Dynamic routes for viewing generated courses
│   └── api/              # API Routes (if applicable)
├── configs/              # Global configurations
│   ├── db.js             # Drizzle database connection instance
│   ├── schema.js         # PostgreSQL table schemas (CourseList, Chapters)
│   └── action.js         # Next.js Server Actions (Database CRUD operations)
├── public/               # Static assets (Placeholders, logos)
├── next.config.mjs       # Next.js & Turbopack configurations
└── tailwind.config.js    # Tailwind CSS configuration
```


