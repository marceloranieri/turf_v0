const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure we're in the project root
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Create a temporary .vercel directory if it doesn't exist
const vercelConfigDir = path.join(projectRoot, '.vercel');
if (!fs.existsSync(vercelConfigDir)) {
  fs.mkdirSync(vercelConfigDir, { recursive: true });
}

// Create a project.json file to specify environment
const projectConfigPath = path.join(vercelConfigDir, 'project.json');
const projectConfig = {
  "projectId": process.env.VERCEL_PROJECT_ID || "your_project_id",
  "orgId": process.env.VERCEL_ORG_ID || "your_org_id"
};

fs.writeFileSync(projectConfigPath, JSON.stringify(projectConfig, null, 2));

try {
  // Deploy to the development environment using npx
  console.log('Deploying to development environment...');
  execSync('npx vercel --env NEXT_PUBLIC_ENVIRONMENT=development --target=development', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_AUTH_REDIRECT_URL: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
      FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
      NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      CRON_SECRET: process.env.CRON_SECRET
    }
  });
  
  console.log('Deployment to development environment completed!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
} 