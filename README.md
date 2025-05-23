# Turf - Community Chat App

Turf is a new kind of social space—one where chats are real, ideas matter, and nobody's chasing likes.

## Features

- User authentication with email/password and Google OAuth
- Daily topics with expiration timers
- Upvoting/downvoting system
- Reactions and comments
- User profiles
- Settings management
- Real-time notifications
- Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   \`\`\`

4. Set up the database schema:
   \`\`\`bash
   curl -X POST http://localhost:3000/api/setup
   \`\`\`

5. Seed the database with initial data:
   \`\`\`bash
   curl -X POST http://localhost:3000/api/seed
   \`\`\`

6. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The easiest way to deploy this app is to use Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fturf)

## Environment Variables

### Required Variables

The following environment variables are required for the application to function:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
TURF_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Settings
NEXT_PUBLIC_APP_NAME=Turf
NEXT_PUBLIC_SITE_URL=your_site_url
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=true

# Email Configuration (if using email features)
EMAIL_SERVER_HOST=your_smtp_host
EMAIL_SERVER_PORT=your_smtp_port
EMAIL_SERVER_USER=your_smtp_user
EMAIL_SERVER_PASSWORD=your_smtp_password
EMAIL_FROM=your_from_email

# Other Settings
NODE_ENV=development
CRON_SECRET=your_cron_secret
```

### Environment Setup

1. **Local Development**
   - Copy the variables above to `.env.local`
   - Fill in your specific values

2. **Vercel Deployment**
   - Add all variables to your Vercel project settings
   - You can use `vercel env pull .env.local` to sync from Vercel to local

3. **Validation**
   - Run `pnpm tsx scripts/check-env-vars.ts` to validate your environment setup
   - This will check for missing or incorrect variables

### Environment Variable Management

Since this is a private repository on GitHub Free, we use the following approach:

1. **Local Development**: Use `.env.local` for local development
2. **Production**: Use Vercel's environment variables
3. **Validation**: Use the included `check-env-vars.ts` script to verify setup

To pull environment variables from Vercel:
```bash
vercel env pull .env.local
```

To validate your environment setup:
```bash
pnpm tsx scripts/check-env-vars.ts
```

## License

This project is licensed under the MIT License.
