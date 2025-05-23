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

## Environment Variables Sync

This project uses GitHub Actions to automatically sync environment variables between Vercel and GitHub. The sync process:

1. Runs daily at 2 AM UTC
2. Can be triggered manually from the GitHub Actions tab
3. Pulls environment variables from Vercel
4. Updates GitHub repository secrets

### Required Secrets

The following secrets must be set in GitHub repository settings:

- `VERCEL_ORG_ID`: Your Vercel organization ID (e.g., "turfapp")
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `VERCEL_TOKEN`: A Vercel access token with appropriate permissions

### Manual Sync

To manually sync environment variables:

1. Go to the "Actions" tab in your GitHub repository
2. Select the "Sync Environment Variables" workflow
3. Click "Run workflow"
4. Select the branch to run on
5. Click "Run workflow"

## License

This project is licensed under the MIT License.
