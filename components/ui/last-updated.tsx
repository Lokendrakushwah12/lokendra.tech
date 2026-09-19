import { formatDate, formatTime } from "@/lib/repo-utils";

/**
 * Resolved at build time from the build commit's date (see next.config.ts).
 *
 * ponytail: this used to fetch the GitHub API at request time behind a 1h
 * unstable_cache. That cannot work on Workers - outbound fetches share
 * Cloudflare egress IPs and GitHub allows 60 unauthenticated requests/hour per
 * IP, so it rate-limited and silently fell back to a hardcoded 2023 date. The
 * value only changes on rebuild anyway, so a build-time constant is both
 * correct and free. If it ever needs to update without a deploy, the fix is a
 * GITHUB_TOKEN secret, not a re-fetch.
 */
const LastUpdated = () => {
  const iso = process.env.NEXT_PUBLIC_LAST_UPDATED;
  const updatedAt = iso ? new Date(iso) : null;

  if (!updatedAt || Number.isNaN(updatedAt.getTime())) return null;

  return (
    <p className="text-xs font-normal text-muted-foreground">
      Last updated by Lokendra on {formatDate(updatedAt)},{" "}
      {formatTime(updatedAt)}
    </p>
  );
};

export default LastUpdated;
