import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every page is prerendered at build time and nothing revalidates ("last
// updated" is a build-time constant), so prerendered pages ship as Workers
// static assets. No KV writes: the free plan's 1,000 writes/day is
// account-wide, other Workers can use it up, and then deploys fail.
// ponytail: switch to the R2 cache if a page ever needs ISR/revalidate.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
