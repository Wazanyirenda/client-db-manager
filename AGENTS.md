# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Cliently is a Next.js 16 CRM app (TypeScript, Tailwind CSS v4, Radix UI) backed by Supabase (PostgreSQL, Auth, Storage, Realtime). Uses npm as the package manager.

### Running the app

1. **Start Docker:** `sudo dockerd &>/tmp/dockerd.log &` (wait ~3s)
2. **Fix Docker perms:** `sudo chmod 666 /var/run/docker.sock`
3. **Start Supabase:** `cd /workspace && supabase start` (pulls containers on first run, ~90s; subsequent starts ~10s)
4. **Apply migrations:** `cd /workspace && supabase db reset` (only needed if schema changed or first setup)
5. **Start dev server:** `npm run dev` (port 3000)

The `.env.local` file must exist with these variables pointing to local Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase status --output json ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<from supabase status --output json SERVICE_ROLE_KEY>
```
Use `supabase status --output json` to get the JWT keys after starting Supabase.

### Key commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Supabase status | `supabase status` |
| DB reset | `supabase db reset` |

### Gotchas

- **No automated tests exist** in this repo (no test framework in dependencies, no test files).
- `npm run lint` exits with code 1 due to pre-existing ESLint errors (mostly `@typescript-eslint/no-explicit-any` and `react-hooks/set-state-in-effect`). These are existing issues, not regressions.
- The `supabase/` directory and `.env.local` are gitignored. Schema migrations live in `supabase/migrations/`.
- The `GEMINI_API_KEY` env var is optional; AI features (dashboard summaries, chat, client insights) gracefully show "not configured" without it.
- Email confirmation is disabled in the local Supabase config, so signup works immediately without email verification.
- The database trigger `handle_new_user()` auto-creates a row in `profiles` when a user signs up via Supabase Auth.
- Docker requires `fuse-overlayfs` storage driver and `iptables-legacy` in the Cloud Agent environment (nested container setup).
