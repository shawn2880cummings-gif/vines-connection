import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.lulu.com" },
      { protocol: "https", hostname: "payhip.com" },
      { protocol: "https", hostname: "pe56d.s3.amazonaws.com" },
    ],
  },
};

export default nextConfig;
