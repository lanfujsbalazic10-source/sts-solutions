# STS Solutions deployment guide

## 1. Prepare the environment

Create a local file named `.env.local` from `.env.local.example` and set a secure admin password:

```bash
cp .env.local.example .env.local
```

Then update the value:

```env
ADMIN_PASSWORD=your_secure_password_here
NODE_ENV=production
```

## 2. Push the project to GitHub

Create a GitHub repository and push the app there.

## 3. Deploy on Vercel

1. Open https://vercel.com
2. Sign in to your account
3. Import the GitHub repository
4. Keep the default Next.js setup
5. Add the environment variable:
   - `ADMIN_PASSWORD`
6. Deploy

## 4. Add the domain

In Vercel:

1. Open the project
2. Go to Settings > Domains
3. Add `sts-solutions.com`
4. Update DNS records as instructed by Vercel

## 5. Final live checks

- homepage loads
- admin login works
- content editor saves
- contact form works

## Admin login

Use the same value you set for `ADMIN_PASSWORD`.

Example:

```text
https://sts-solutions.com/admin/login
```
