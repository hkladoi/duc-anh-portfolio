import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL || "https://portfolio.hkladoi.tech";

export default defineConfig({
  site,
  output: "static",
  build: {
    format: "directory"
  }
});
