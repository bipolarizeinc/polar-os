export function customerDestination(value?: string | null, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x20]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://www.polarpaw.online");
    if (url.origin !== "https://www.polarpaw.online" || /^\/(?:api|welcome|founder|admin)(?:\/|$)/.test(url.pathname) || url.pathname === "/etsa/login") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return fallback; }
}
