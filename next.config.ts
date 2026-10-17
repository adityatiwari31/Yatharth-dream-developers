import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Resize pictures on Cloudinary instead of on the server. See lib/cloudinaryLoader.ts.
    // On Render this keeps the small instance free of image-processing work.
    loader: "custom",
    loaderFile: "./lib/cloudinaryLoader.ts",
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  // The "Import starter villas" button in /admin reads these files from disk at runtime.
  outputFileTracingIncludes: {
    "/api/seed": ["./public/seed/**/*"],
  },
};

export default nextConfig;
