/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  }
};
module.exports = nextConfig;
