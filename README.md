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
- `Authentication` -> `Email Templates` -> `Magic Link`:
  - Subject 可直接使用：`supabase/templates/magic_link_otp_subject_zh.txt`
  - HTML 可直接使用：`supabase/templates/magic_link_otp_zh.html`
  - 关键是模板里必须包含 `{{ .Token }}`（6位验证码），不要只放 `{{ .ConfirmationURL }}`
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

## 6) Increase hourly email capacity

- Default Supabase email service is only for testing and has very low throughput.
- 默认发件人是 Supabase 官方地址，如果你不想用官方发件，改成自定义 SMTP 即可。
- For higher volume, configure custom SMTP in:
  - `Authentication` -> `Settings` -> `SMTP Settings`
- After custom SMTP is enabled, tune rate limits in:
  - `Authentication` -> `Rate Limits`

## Current modules

- `app/auth/sign-in/page.tsx`: email sign-in page
- `app/auth/sign-up/page.tsx`: email sign-up page
- `components/auth/EmailOtpAuthCard.tsx`: shared email OTP auth card (send + verify)
- `app/resume/new/page.tsx`: resume create page
- `components/auth/UserSessionCard.tsx`: current user and sign-out
- `components/resume/ResumeForm.tsx`: main form and submit logic
- `components/resume/fields/InputField.tsx`: reusable input
- `components/resume/fields/TextareaField.tsx`: reusable textarea
- `lib/supabaseClient.ts`: Supabase browser client
- `middleware.ts`: auth route protection for `/resume/*`
- `types/resume.ts`: resume insert type
