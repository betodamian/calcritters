// Shared site URL used for metadata, the sitemap, and robots.txt. Falls back to
// a placeholder in development so nothing throws when the env var isn't set;
// deployments should set NEXT_PUBLIC_SITE_URL to the real production URL.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://calcritters.example.edu"
).replace(/\/+$/, "");
