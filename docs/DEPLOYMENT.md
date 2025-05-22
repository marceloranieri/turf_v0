# Deployment Guide

This guide explains how to deploy the application to different environments using Vercel.

## Prerequisites

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Set up environment variables:
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Deployment Scripts

The project includes two deployment scripts:

1. Development Deployment:
```bash
npm run deploy:dev
```
This will deploy to the development environment with `NEXT_PUBLIC_ENVIRONMENT=development`.

2. Production Deployment:
```bash
npm run deploy:prod
```
This will deploy to production with `NEXT_PUBLIC_ENVIRONMENT=production`.

## Manual Deployment

If you prefer to deploy manually:

1. Development:
```bash
vercel --env NEXT_PUBLIC_ENVIRONMENT=development --target=development
```

2. Production:
```bash
vercel --env NEXT_PUBLIC_ENVIRONMENT=production --prod
```

## Environment Configuration

The application uses different environment configurations:

- Development: `NEXT_PUBLIC_ENVIRONMENT=development`
- Production: `NEXT_PUBLIC_ENVIRONMENT=production`

These environments are configured in `vercel.json` and affect:
- Environment indicator display
- API endpoints
- Feature flags
- Debug logging

## Deployment Process

1. The deployment scripts will:
   - Install Vercel CLI if not present
   - Create necessary configuration files
   - Deploy to the specified environment
   - Set appropriate environment variables

2. After deployment:
   - Verify the deployment URL
   - Check the environment indicator
   - Test critical functionality
   - Monitor error logs

## Troubleshooting

Common issues and solutions:

1. Deployment fails with "Project not found":
   - Verify `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID`
   - Ensure you're logged in to Vercel CLI

2. Environment variables not set:
   - Check `.env` file
   - Verify Vercel project settings

3. Build errors:
   - Check build logs in Vercel dashboard
   - Verify all dependencies are installed
   - Ensure TypeScript compilation passes

## Best Practices

1. Always test in development before deploying to production
2. Keep environment variables secure and up to date
3. Monitor deployment logs for any issues
4. Use feature flags for gradual rollouts
5. Maintain separate environments for testing and production 