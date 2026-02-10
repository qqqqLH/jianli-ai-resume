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

## 4) Run dev server

```bash
npm run dev
```

Open:

`http://localhost:3000/resume/new`

## Current modules

- `app/resume/new/page.tsx`: resume create page
- `components/resume/ResumeForm.tsx`: main form and submit logic
- `components/resume/fields/InputField.tsx`: reusable input
- `components/resume/fields/TextareaField.tsx`: reusable textarea
- `lib/supabaseClient.ts`: Supabase client
- `types/resume.ts`: resume insert type
