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

This project is ready for deployment to Vercel.

1. Copy `.env.local.example` to `.env.local`
2. Set a secure `ADMIN_PASSWORD`
3. Push the repo to GitHub
4. Import the repo into Vercel
5. Add the `ADMIN_PASSWORD` environment variable in Vercel
6. Connect the domain `sts-solutions.com`

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full step-by-step guide.

## Notes

The app includes:
- public business landing page
- protected admin dashboard
- editable site content
- contact form endpoint
- local production-ready setup
