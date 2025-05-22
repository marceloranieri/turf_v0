const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Environment variables are stored in Vercel dashboard for production
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
}

module.exports = nextConfig 