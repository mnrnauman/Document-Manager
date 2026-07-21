/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com', 'document.gencoreit.com'],
    unoptimized: true,
  },
  allowedDevOrigins: ['*.replit.dev', '*.kirk.replit.dev', '*.pike.replit.dev', '*.repl.co'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...(isDev ? [
            { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
            { key: 'Pragma', value: 'no-cache' },
          ] : []),
        ],
      },
    ];
  },
  basePath: '',
};

export default nextConfig;
