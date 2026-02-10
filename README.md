# AI Resume Assistant

Tech stack:
- Next.js 15 (App Router)
- Tailwind CSS
- Supabase
- Lucide React

## 1) Install

```bash
npm install
```

## 2) Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://febcgezefxryyfypuhyz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jPthxJcBGqNu9cmoO8T9hQ_xNOtEYFE
```

## 3) Create table in Supabase

Run the SQL in:

`supabase/sql/create_resumes_table.sql`

## 4) Configure email auth in Supabase

In Supabase Dashboard:

- `Authentication` -> `Providers` -> `Email`: keep enabled
- `Authentication` -> `URL Configuration`:
  - Site URL (local): `http://localhost:3000`
  - Additional Redirect URLs:
    - `http://localhost:3000/auth/sign-in`
    - `http://localhost:3001/auth/sign-in`
    - `https://jianli-ai-resume.vercel.app/auth/sign-in`

## 5) Run dev server

```bash
npm run dev
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/auth/sign-up`
- `http://localhost:3000/resume/new` (protected route, requires login)

## Current modules

- `app/auth/sign-in/page.tsx`: email sign-in page
- `app/auth/sign-up/page.tsx`: email sign-up page (with email confirmation)
- `app/resume/new/page.tsx`: resume create page
- `components/auth/UserSessionCard.tsx`: current user and sign-out
- `components/resume/ResumeForm.tsx`: main form and submit logic
- `components/resume/fields/InputField.tsx`: reusable input
- `components/resume/fields/TextareaField.tsx`: reusable textarea
- `lib/supabaseClient.ts`: Supabase browser client
- `middleware.ts`: auth route protection for `/resume/*`
- `types/resume.ts`: resume insert type
