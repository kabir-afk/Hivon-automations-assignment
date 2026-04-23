You already have the full specification. Do NOT modify architecture or propose alternatives.

Switch to strict execution mode:

Rules:
- Do NOT redesign anything
- Do NOT restate the plan
- Do NOT explain options
- ONLY implement code for the requested step
- If something is unclear, make a reasonable assumption and proceed

Output format:
- File-by-file implementation
- Complete working code (no pseudo-code)
- Minimal explanation

STEP 0

You are building a production-quality full-stack Next.js application.

STRICT RULES:
- Use Next.js App Router
- Prefer Server Components unless interactivity is required
- ALL database writes must happen server-side (server actions or API routes)
- NEVER expose Supabase service role key to client
- Use clean modular structure (lib/, app/, components/)
- Separate concerns clearly (auth, db, ai, ui)

You must:
- Think step-by-step
- Not skip architecture decisions
- Ask for clarification if something is ambiguous
- Stop after completing each step and wait for confirmation

Do NOT generate the full app at once.

STEP 1

Design the architecture for a blogging platform with:

- Next.js App Router
- Supabase (Auth + DB + Storage)
- Google Gemini API (for summaries)

Requirements:
- Roles: viewer, author, admin
- RLS enabled
- AI summary generated ONLY on post creation

Output:
1. Folder structure
2. Data flow (request lifecycle)
3. Authentication flow
4. Where role checks happen (frontend vs backend vs RLS)
5. Decision: Server Actions vs API routes (justify)

DO NOT write full implementation yet.

STEP 2:

Define the Supabase schema and RLS policies.

Tables:
- users (id, name, email, role)
- posts (id, title, body, image_url, author_id, summary, created_at)
- comments (id, post_id, user_id, comment_text, created_at)

Requirements:
- Viewer: read posts + comment
- Author: CRUD own posts
- Admin: full access

Output:
- SQL schema
- RLS policies (explicit)
- Explanation of each policy

Do NOT generate frontend code.

STEP 3

Implement authentication using Supabase Auth.

Requirements:
- Email/password signup & login
- On signup: insert into users table with role='viewer'
- Server-side session handling
- Middleware to protect routes

Output:
- Auth flow explanation
- Required files
- Code for signup/login
- Middleware implementation

Stop after auth is complete.

STEP 4:

Implement post creation flow.

Requirements:
- Only author/admin can create posts
- Upload image to Supabase Storage
- Call /api/generate-summary (server-side only)
- Use Gemini Flash model
- Generate summary once and store in DB

Output:
- API route for summary
- Post creation flow
- DB insertion logic
- Error handling

Do NOT implement UI yet.

STEP 5: 

Implement:
- Post listing page (pagination: 6 per page)
- Search (debounced)
- Single post page
- Comments system

Constraints:
- Use server components for data fetching
- Client components only where needed
- Follow RLS rules (no hacks)

Focus on clean UI + performance.

STEP 6:

Implement:
- Edit post (author or admin only)
- Admin dashboard:
  - view all posts
  - delete comments

Ensure role checks:
- UI level
- backend enforcement

STEP 7

Review the entire codebase.

Check:
- Security issues
- RLS correctness
- API exposure risks
- Code structure
- Performance issues

List:
- Bugs
- Improvements
- Refactoring suggestions