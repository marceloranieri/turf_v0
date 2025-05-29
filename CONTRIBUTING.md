# Contributing to Turf

## 🔒 Environment Variable Usage Rules

### Supabase Environment Variables

#### 1. Frontend Code (`/app/components`, `/app/(client-routes)`)

✅ **Correct Usage:**
\`\`\`typescript
process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
\`\`\`

🚫 **Never Use:**
\`\`\`typescript
process.env.SUPABASE_URL
process.env.SUPABASE_ANON_KEY
process.env.TURF_SERVICE_ROLE_KEY
\`\`\`

#### 2. Backend Code (`/app/api`, `/lib/server`, cron jobs, middleware)

✅ **Correct Usage:**
\`\`\`typescript
process.env.SUPABASE_URL
process.env.SUPABASE_ANON_KEY
process.env.TURF_SERVICE_ROLE_KEY (only in secured server-side code)
\`\`\`

🚫 **Never Use:**
\`\`\`typescript
process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
\`\`\`

### ⚠️ Security Notes

1. `TURF_SERVICE_ROLE_KEY` has **admin privileges** and must **never**:
   - Appear in frontend code
   - Be sent to the browser
   - Be exposed in client-side bundles
   - Be included in any public repositories

2. Treat `TURF_SERVICE_ROLE_KEY` like a private server key:
   - Only use in secured server-side code
   - Never log or expose in error messages
   - Keep it in `.env.local` and Vercel environment variables only

### 🔍 How to Verify

1. **Frontend Code Check:**
   \`\`\`bash
   grep -r "process.env.SUPABASE_" ./app/components ./app/\(client-routes\)
   \`\`\`
   Should only find `NEXT_PUBLIC_` variants.

2. **Backend Code Check:**
   \`\`\`bash
   grep -r "process.env.NEXT_PUBLIC_SUPABASE_" ./app/api ./lib/server
   \`\`\`
   Should return no results.

### 🚀 Deployment Checklist

Before deploying, ensure:

1. All required environment variables are set in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `TURF_SERVICE_ROLE_KEY`

2. Local `.env.local` matches Vercel environment variables

3. No sensitive keys are exposed in:
   - Client-side code
   - Public repositories
   - Build logs
   - Error messages
