import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "bilbatez.dev",
    short_name: "bilbatez.dev",
    description: "Personal Website | Bilbatez.dev",
    start_url: "/",
    background_color: "#fff",
    theme_color: "#fff",
  };
}
