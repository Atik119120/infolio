// Returns the public portfolio URL for a username.
// Uses subdomain format (username.maindomain) on the production custom domain,
// and falls back to path-based (/username) on preview/lovable/localhost.
const SUBDOMAIN_HOSTS = ["alokchitra.site"];

export function getPortfolioUrl(username?: string | null): string {
  if (!username) return "";
  if (typeof window === "undefined") return `/${username}`;
  const host = window.location.hostname.toLowerCase();
  const proto = window.location.protocol;

  for (const root of SUBDOMAIN_HOSTS) {
    if (host === root || host === `www.${root}`) {
      return `${proto}//${username}.${root}`;
    }
  }
  return `${window.location.origin}/${username}`;
}
