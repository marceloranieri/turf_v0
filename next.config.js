/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  }
  // Environment variables are stored in Vercel dashboard for production
}

module.exports = nextConfig 