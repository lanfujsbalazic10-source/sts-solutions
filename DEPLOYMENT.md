# STS Solutions deployment guide

## 1. Create the Supabase database

1. Create a Supabase project at https://supabase.com.
2. Open the project's SQL Editor.
3. Run the SQL in `supabase/schema.sql`.
4. In Project Settings > API, copy the project URL and the server-side service role key.

The service role key bypasses row-level security. Keep it private: never put it in frontend code, never prefix it with `NEXT_PUBLIC_`, and never commit it.

## 2. Configure local development (optional)

Create `.env.local` from the template:

```bash
cp .env.local.example .env.local
```

Set these values in `.env.local`:

```env
ADMIN_PASSWORD=use_a_long_unique_password
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_only_key
```

Restart the development server after changing environment variables. When Supabase variables are omitted in development, the app uses the local JSON fallback. Production requires both Supabase variables.

## 3. Deploy from GitHub to Vercel

The repository is `lanfujsbalazic10-source/sts-solutions`.

1. Sign in at https://vercel.com.
2. Add a new project and import the GitHub repository above.
3. Keep the default Next.js build settings.
4. In Project Settings > Environment Variables, add `ADMIN_PASSWORD`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` for Production (and Preview if needed).
5. Deploy or redeploy after adding the variables.

Use a unique, strong admin password. Do not reuse the old local demo password.

## 4. Connect the domain

In Vercel, open Project Settings > Domains, add `sts-solutions.com`, and apply the DNS records Vercel displays at the domain registrar.

## 5. Verify production

- Homepage loads on the Vercel URL.
- `/admin/login` accepts the configured `ADMIN_PASSWORD`.
- Admin changes remain after a redeploy.
- Contact submissions are stored in the Supabase `contact_submissions` table.

Admin login path:

```text
https://sts-solutions.com/admin/login
```
