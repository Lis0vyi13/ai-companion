import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://d-id-public-bucket.s3.us-west-2.amazonaws.com/*")],
  },
};

export default nextConfig;

