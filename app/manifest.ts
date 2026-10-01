import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Winter Arc Daily Tracker",
    short_name: "WinterArc",
    description: "Daily discipline, habits, and workout routine planner.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#08090b",
    theme_color: "#08090b",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
