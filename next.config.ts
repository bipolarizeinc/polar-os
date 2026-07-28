import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // The approved brand masters already ship as optimized production PNGs.
    // Serving them directly avoids intermittent 400 responses from the
    // deployment image transformer on large, full-viewport requests.
    unoptimized: true,
  },
};

export default nextConfig;
