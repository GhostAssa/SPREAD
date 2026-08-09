import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    // Placeholder images are hotlinked from Google's mockup CDN — skip the
    // built-in Sharp resizer and serve them as-is instead of proxying/resizing.
    unoptimized: true,
  },
  async headers() {
    // These are public, read-only, unauthenticated endpoints meant to be
    // consumed cross-origin by the mobile app (and any other client) — no
    // cookies/auth involved, so a permissive CORS policy here is safe.
    // Mutating and authenticated routes (auth/*, admin/*, submissions,
    // tips, contact, newsletter) deliberately do NOT get this treatment.
    return [
      {
        source: "/api/:path(articles|articles/.*|facts|events|settings)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
