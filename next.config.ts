import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger request body sizes for file uploads (250MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '250mb',
    },
  },
  // Configure API routes to accept larger payloads
  api: {
    bodyParser: {
      sizeLimit: '250mb',
    },
  },
};

export default nextConfig;
