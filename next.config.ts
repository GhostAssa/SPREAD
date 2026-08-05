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
};

export default nextConfig;
