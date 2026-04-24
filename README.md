# BlogAI - AI-Powered Production Blogging Platform

A high-performance, full-stack blogging platform built with **Next.js 15**, **Supabase**, and **Google Gemini AI**. This project features a modern UI, role-based access control, and automated AI content summarization.

---

# Submission Links

* **GitHub Repository**: [https://github.com/kabir-afk/Hivon-automations-assignment](https://github.com/kabir-afk/Hivon-automations-assignment)
* **Live Deployed URL**: [https://hivon-automations-assignment-psi.vercel.app/](https://hivon-automations-assignment-psi.vercel.app/)

---

# AI Tools Used

### Tool(s) Used:

Antigravity

### Why I Chose This Tool:

The reason I chose this tool is because I have worked with it before and I am very familiar with its features and capabilities. The state of the art LLM models that they provide achieve more with less prompting

### How It Helped During Development:

- Handled styling using tailwind CSS v4 and I didnt have to think for the styling overhead
- Was able to setup the project related supabase and Gemini API for auth and database quickly and securely. 
- It also helped me setting up the Row Level Security for the database.

---

## Features

* **Authentication & Authorization**: Secure email/password authentication using Supabase Auth.
* **Role-Based Access Control (RBAC)**:

  * **Viewer**: Read posts and comment.
  * **Author**: Create and edit own posts.
  * **Admin**: Full control over all posts and comments via a dedicated dashboard.
* **AI Content Summarization**: Automatically generates concise summaries for every post using the **Google Gemini 1.5 Flash** model.
* **Post Management**:

  * Rich text content support.
  * Image uploads via Supabase Storage.
  * Server-side pagination (6 posts per page).
  * Debounced real-time search.
* **Modern UI/UX**:

  * Responsive design with **Tailwind CSS v4**.
  * Glassmorphism effects and premium animations.
  * Global loading states and skeleton screens for a smooth experience.
  * Real-time toast notifications with `react-hot-toast`.
* **Performance**: Built with Next.js App Router, leveraging Server Components for optimal data fetching.

---

# Feature Logic

### Authentication Flow

The platform uses **Supabase Auth** for secure user management:
1.  **Signup/Login**: Users provide email and password. Upon signup, custom metadata (like name) is stored.
2.  **Session Management**: Sessions are managed via **HTTP-only cookies** using the `@supabase/ssr` package, ensuring secure persistence across page reloads.
3.  **Protection**: Middleware and Server Components check for valid sessions. Unauthorized users are redirected to the login page when attempting to access protected routes like `/dashboard`.

### Role-Based Access Control

RBAC is enforced at multiple layers:
1.  **Database Level (RLS)**: Row Level Security policies ensure users can only modify their own posts, while admins have global access.
2.  **Application Level**: The `users` table stores a `role` field (`viewer`, `author`, `admin`). This role is fetched server-side to restrict access to specific UI components and Server Actions.
3.  **UI Level**: Conditional rendering hides administrative features (like the Admin Dashboard) from non-admin users.

### Post Creation Logic

The post creation flow is handled via a **Next.js Server Action**:
1.  **Validation**: Ensures required fields (title, body) are present and the user has the correct role.
2.  **Image Upload**: If an image is provided, it is uploaded to **Supabase Storage**. The public URL is retrieved for database insertion.
3.  **AI Enrichment**: The post body is sent to the Gemini API to generate a summary.
4.  **Persistence**: The complete post record (including image URL and AI summary) is inserted into the `posts` table in a single transaction.

### AI Summary Generation Flow

AI summaries are generated dynamically during content creation:
1.  **Trigger**: Triggered automatically when an author or admin submits the post creation form.
2.  **API Integration**: Uses the `gemini-1.5-flash` model for high-speed, cost-effective processing.
3.  **Prompt Engineering**: A specific prompt instructs the AI to generate a 200-word summary in plain text, ensuring consistency and readability without markdown clutter.
4.  **Storage**: The summary is saved alongside the post, eliminating the need for repeated API calls on every page load.

---

## Tech Stack

* **Framework**: Next.js 15+ (App Router)
* **Language**: JavaScript (ES6+)
* **Styling**: Tailwind CSS v4, Vanilla CSS
* **Database & Auth**: Supabase (PostgreSQL + RLS)
* **AI Engine**: Google Gemini API (@google/generative-ai)
* **State & UI**: react-hot-toast

---

## Project Architecture

The project follows a clean, modular structure as per production standards:

* `src/app/`: Next.js App Router pages and layouts.
* `src/components/`: Reusable UI components (Shared, Posts, Dashboard).
* `src/lib/`: Core logic, including:

  * `supabase/`: Server and Client clients for database interaction.
  * `actions/`: Next.js Server Actions for secure database writes.
  * `ai/`: Gemini API integration logic.
* `public/`: Static assets.

---

## Route Map

### Public Routes
*   `/`: **Landing Page** - High-converting homepage featuring recent posts and platform highlights.
*   `/posts`: **Blog Feed** - Searchable and paginated list of all blog posts.
*   `/posts/[id]`: **Post Detail** - View full post content, AI-generated summary, and comments.
*   `/login` / `/signup`: **Authentication** - Secure access to the platform.

### Protected Routes (Role-Based)
*   `/dashboard`: **User/Admin Dashboard** - Personalized overview based on user role.
*   `/dashboard/create`: **Post Creator** - Interface for Authors/Admins to publish new content.
*   `/dashboard/edit/[id]`: **Post Editor** - Update existing content and AI summaries.
*   `/dashboard/comments`: **Comment Manager** - Admin-only interface for moderating community engagement.

---

## Database Schema & RLS

The database is built on PostgreSQL with Row Level Security (RLS) enabled:

* **`users`**: Managed by Supabase Auth with custom role metadata (`viewer`, `author`, `admin`).
* **`posts`**: Stores blog content, image URLs, and AI-generated summaries.
* **`comments`**: Threaded comments for post engagement.

**RLS Policies**:

* `posts`: Publicly readable; authors can only CRUD their own; admins have full access.
* `comments`: Authenticated users can create; admins can delete.

---

# Cost Optimization

To ensure the platform remains scalable and cost-effective:
*   **One-Time Generation**: Summaries are generated only once during post creation and stored in the database. Subsequent reads are free.
*   **Model Selection**: Uses **Gemini 1.5 Flash**, which offers a superior balance of performance and lower token costs compared to larger models.
*   **Input Truncation**: Prompting constraints ensure the AI focuses on core content, reducing unnecessary token usage.
*   **Server-Side Execution**: All AI calls happen in Server Actions, preventing client-side API exposure and redundant calls.

---

# Development Understanding

### Bug Encountered

After signup, I was able to see the users in authentication.users table but couldn't see them in the public.users table.  While the auth worked perfectly I could not test RBAC for different roles like admin, author and viewer. Could only work as viewer as user_role was defaulting to 'viewer' for every signup. 

### How You Resolved It

I updated the RLS policies so that after authentication users reflect in the public.users table and I was able to test RBAC for different roles.

### Key Architectural Decisions

*   **Next.js App Router**: Chosen for its robust SEO capabilities, built-in routing, and seamless integration of Server Components for faster initial loads.
*   **Server Actions**: Used for all data mutations to eliminate the need for manual API route management and to simplify form handling.
*   **Supabase (BaaS)**: Leveraged for a unified solution for Auth, Database, and Storage, significantly reducing infrastructure overhead.
*   **Glassmorphism Design**: Implemented a modern, premium aesthetic using Tailwind CSS v4 to provide a high-end feel while maintaining performance.

---

## Setup Instructions

### 1. Prerequisites

* Node.js 18.x or later
* A Supabase account and project. After setting up the project in Supabase, run the queries in `supabase/migrations/` in the SQL Editor to create the users table and RLS policies.
* A Google Gemini API key

### 2. Environment Variables

Create a `.env` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

*NOTE*
- After signup you can update your role to admin or author from the dashboard.
- After updating your role to admin or author you need to refresh the page to see the changes.

### 3. Installation

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 to view the application.

---

# Deployment

### Platform Used:

Vercel

### Steps:

Uploaded the project to Vercel by connecting the GitHub repository.

### Environment Variables Configured:

The ones mentioned in the .env file are configured in the deployment.

---

## Verification Plan

* **Auth Flow**: Test signup, login, and protected route redirection.
* **Post Creation**: Verify image upload to Supabase Storage and AI summary generation.
* **RBAC**: Ensure authors cannot edit other authors' posts and viewers cannot access the Admin Dashboard.
* **Search & Pagination**: Verify debounced search results and pagination controls.