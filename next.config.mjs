/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.modules = ['.', 'node_modules'];
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
}

export default nextConfig