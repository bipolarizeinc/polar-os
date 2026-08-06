import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // The approved brand masters already ship as optimized production PNGs.
    // Serving them directly avoids intermittent 400 responses from the
    // deployment image transformer on large, full-viewport requests.
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/media/polar/01_POLAR_Greeting.mp4", destination: "/api/media/polar/greeting" },
      { source: "/media/polar/02_Products_Transition.mp4", destination: "/api/media/polar/products" },
      { source: "/media/polar/03_Blueprint_Transition.mp4", destination: "/api/media/polar/blueprint" },
      { source: "/media/polar/04_DrDocx_Transition.mp4", destination: "/api/media/polar/drdocx" },
      { source: "/media/polar/05_Nexus_Transition.mp4", destination: "/api/media/polar/nexus" },
      { source: "/media/polar/06_About_Transition.mp4", destination: "/api/media/polar/about" },
      { source: "/media/polar/07_Intake_Transition.mp4", destination: "/api/media/polar/intake" },
      { source: "/media/polar/08_POLAR_Idle_Inquiry.mp4", destination: "/api/media/polar/idle" },
      { source: "/brand/audio/YA.wav", destination: "/api/media/polar/music" },
    ];
  },
};

export default nextConfig;
