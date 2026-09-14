import { execSync } from "node:child_process";
import type { NextConfig } from "next";

// The site only changes when it is rebuilt, so the build commit's date IS the
// "last updated" time. Resolving it here avoids a runtime GitHub API call:
// Workers egress from Cloudflare IPs shared across customers, and GitHub's
// unauthenticated limit is 60 requests/hour per IP, so that call fails far more
// often than it succeeds.
const lastUpdated = (() => {
  try {
    return execSync("git log -1 --format=%cI", { encoding: "utf8" }).trim();
  } catch {
    return new Date().toISOString();
  }
})();

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_LAST_UPDATED: lastUpdated },
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lokendrakushwah12.github.io",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  /* config options here */
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

