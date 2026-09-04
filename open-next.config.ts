import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// KV over R2 here: the only revalidating data is the hourly GitHub "last
// updated" fetch, which is far under the free plan's 1,000 KV writes/day.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
