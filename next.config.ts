import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /pdf\.worker\.entry\.js$/,
      use: { loader: 'worker-loader' },
    })

    return config
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
