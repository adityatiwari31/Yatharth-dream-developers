import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Pictures are resized by Cloudinary, not by the server. See lib/cloudinaryLoader.ts.
    // This also keeps the site clear of Vercel's own image-optimisation quota.
    loader: "custom",
    loaderFile: "./lib/cloudinaryLoader.ts",
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
