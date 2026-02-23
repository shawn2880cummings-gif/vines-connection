import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.lulu.com" },
      { protocol: "https", hostname: "payhip.com" },
    ],
  },
};

export default nextConfig;
