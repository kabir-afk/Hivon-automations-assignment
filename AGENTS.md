<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

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

Stop re-planning.
<!-- END:nextjs-agent-rules -->
