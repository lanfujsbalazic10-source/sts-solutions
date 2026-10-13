This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Local admin login

Use the admin password configured in `.env.local`.

Default local value for development:

```env
ADMIN_PASSWORD=stsadmin
```

## Production deployment

The project uses Supabase for persistent production storage and Vercel for hosting.

1. Create a Supabase project and run `supabase/schema.sql` in its SQL Editor.
2. Import `lanfujsbalazic10-source/sts-solutions` into Vercel.
3. Add `ADMIN_PASSWORD`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel's project environment variables.
4. Deploy and connect `sts-solutions.com`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full step-by-step guide.

## Notes

The app includes:
- public business landing page
- protected admin dashboard
- editable site content
- contact form endpoint
- local production-ready setup
