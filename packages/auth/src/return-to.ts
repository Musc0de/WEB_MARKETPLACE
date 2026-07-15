export const ALLOWED_HOSTS = [
  'localhost', // For local development
  'starsuperscare.com', // Primary production domain
  'www.starsuperscare.com',
  'api.starsuperscare.com',
];

/**
 * Validates and safely parses a return_to URL to prevent Open Redirect vulnerabilities.
 * If the URL is invalid, relative, or its host is not in the ALLOWED_HOSTS list,
 * it returns the provided safe fallback URL.
 *
 * @param url The untrusted redirect URL string
 * @param fallback The default safe URL (e.g. '/')
 * @returns A safe string URL to redirect the user to
 */
export function getSafeReturnTo(url: string | null | undefined, fallback: string = '/'): string {
  if (!url || typeof url !== 'string') return fallback;

  try {
    // If it's a relative path starting with '/', we consider it safe for the same origin
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }

    const parsedUrl = new URL(url);
    if (ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
      return url;
    }

    return fallback;
  } catch (_error) {
    // URL parsing failed
    return fallback;
  }
}
