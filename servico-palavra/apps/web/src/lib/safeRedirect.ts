const DEFAULT_REDIRECT = "/app";
const INTERNAL_ORIGIN = "https://servico-palavra.invalid";

/**
 * Accept only application routes after authentication. Untrusted query values
 * must never be sent directly to Next.js router.push().
 */
export function getSafePostLoginRedirect(candidate: string | null | undefined): string {
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(candidate) ||
    candidate.trim() !== candidate
  ) {
    return DEFAULT_REDIRECT;
  }

  try {
    const url = new URL(candidate, INTERNAL_ORIGIN);
    const isProtectedRoute =
      url.pathname === "/app" ||
      url.pathname.startsWith("/app/") ||
      url.pathname === "/admin" ||
      url.pathname.startsWith("/admin/");

    if (url.origin !== INTERNAL_ORIGIN || !isProtectedRoute) {
      return DEFAULT_REDIRECT;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_REDIRECT;
  }
}
