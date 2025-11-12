import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Enable static export
  output: 'export', 

  // 2. Set the base path for GitHub Pages
  basePath: `/portfolio`,
  assetPrefix: `/portfolio/`,

  // 3. Optional: Disable default image optimization, which isn't compatible with static export
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BOT_TOKEN: process.env.NEXT_PUBLIC_BOT_TOKEN,
    NEXT_PUBLIC_CHAT_ID: process.env.NEXT_PUBLIC_CHAT_ID
  },
};

export default nextConfig;
