/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Use standalone for server runtime; Azure Static Web Apps supports Next.js SSR
  output: "standalone",
  trailingSlash: true,
  images: {
    // Avoid Next Image optimization in SWA
    unoptimized: true,
    domains: ["images.unsplash.com", "localhost", "*.blob.core.windows.net"],
  },
};

module.exports = nextConfig;
