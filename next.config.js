/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker multi-stage build — emits a self-contained server.js
  output: 'standalone',

  // Next.js 15: serverComponentsExternalPackages moved from experimental to top-level
  serverExternalPackages: ['@radix-ui/react-icons'],

  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    // In Docker the backend is at http://backend:8000 (service name).
    // Outside Docker (local dev) it falls back to http://localhost:8000.
    const apiBase =
      process.env.INTERNAL_API_URL ||   // set this in docker-compose for server-side rewrites
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:8000';

    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
