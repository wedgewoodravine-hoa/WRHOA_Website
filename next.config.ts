import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-east-1.amazonaws.com",
        pathname: "/assets.knackhq.com/**",
      },
      {
        protocol: "https",
        hostname: "assets.knackhq.com",
      },
    ],
  },
};

export default nextConfig;
