# GitHub + Vercel Integration (One-Click Deploy)

User তার নিজের GitHub-এ repo বানাবে এবং নিজের Vercel account-এ deploy করবে — সব app-এর ভিতর থেকে, OAuth দিয়ে।

## যা যা লাগবে (One-time admin setup)

আপনাকে দুটো OAuth App register করতে হবে — এগুলো ছাড়া এই feature কাজ করবে না:

### 1. GitHub OAuth App
- যান: https://github.com/settings/developers → New OAuth App
- Homepage URL: `https://alphaportfolio0.lovable.app`
- Authorization callback URL: `https://wrjkispvsmgjlfexbgca.supabase.co/functions/v1/github-oauth-callback`
- Client ID + Client Secret পাবেন → আমাকে secret হিসেবে দেবেন

### 2. Vercel Integration
- যান: https://vercel.com/dashboard/integrations/console → Create Integration
- Redirect URL: `https://wrjkispvsmgjlfexbgca.supabase.co/functions/v1/vercel-oauth-callback`
- Integration Type: "Generic" (any user install করতে পারবে)
- Client ID + Client Secret পাবেন → আমাকে secret হিসেবে দেবেন

আমি যে secrets চাইব: `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `VERCEL_CLIENT_ID`, `VERCEL_CLIENT_SECRET`

## Architecture

```text
User Dashboard → [Connect GitHub] → GitHub OAuth → token saved
              → [Connect Vercel] → Vercel OAuth → token saved
              → [Deploy] → 
                  1. GitHub: template repo fork/create on user's account
                  2. Push portfolio config (username, supabase keys) as env file
                  3. Vercel: create project linked to that repo
                  4. Trigger deploy → returns live URL
              → Redeploy / View / Disconnect buttons
```

## Database

নতুন table `user_integrations`:
- `user_id`, `provider` ('github' | 'vercel')
- `access_token` (encrypted, RLS locked to user only)
- `account_login` (GitHub username / Vercel team slug)
- `metadata` (jsonb — repo_url, project_id, deploy_url, etc.)

## Edge Functions (নতুন)

1. `github-oauth-callback` — code → access_token exchange, saves to DB
2. `vercel-oauth-callback` — code → access_token exchange, saves to DB
3. `deploy-portfolio` — orchestrates:
   - GitHub API: create repo from template (`infolio-portfolio-template`)
   - GitHub API: commit `.env.production` with `VITE_PORTFOLIO_USERNAME`, supabase keys
   - Vercel API: `POST /v9/projects` link to repo
   - Vercel API: `POST /v13/deployments` trigger build
   - Update `user_integrations.metadata.deploy_url`
4. `disconnect-integration` — revoke + delete row

## Template Repo (আমি বানাবো না — manual)

একটা public GitHub repo লাগবে: `infolio-portfolio-template` — যা current React app-এর clone, build-time-এ `VITE_PORTFOLIO_USERNAME` env থেকে username নিয়ে শুধু ওই user-এর portfolio render করে। এটা আপনাকে আলাদা ভাবে publish/maintain করতে হবে। আপাতত আমি placeholder URL রাখব, পরে আপনি repo URL দিলে edit করব।

## UI

নতুন page: `/dashboard/deploy`
- "Connect GitHub" card (status badge)
- "Connect Vercel" card (status badge)  
- "Deploy to Vercel" button (disabled until both connected)
- Deploy history list with live URL + redeploy button

Sidebar-এ "Deploy" link add।

## Limitations (সততার সাথে)

- Template repo manually maintain করতে হবে (auto-sync নেই)
- Vercel free tier limits user-এর account-এ apply হবে
- Custom domain Vercel-এ user নিজে add করবে (আমি UI দেব না এই round-এ)
- GitHub OAuth + Vercel Integration register করা manual — এটা skip করা যায় না

## Build Order

1. DB migration (user_integrations table + RLS)
2. 4টা edge functions
3. `/dashboard/deploy` page + sidebar link
4. Secret request: 4টা OAuth credential

Approve করলে DB migration দিয়ে শুরু করব এবং OAuth credentials চাইব।
