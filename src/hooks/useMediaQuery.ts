import { useState, useEffect } from "react";

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * Updates reactively when the viewport crosses the breakpoint.
 *
 * @example
 * import { MEDIA } from "../constants/breakpoints";
 * const isMobile = useMediaQuery(MEDIA.MOBILE);
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (canMatch() ? window.matchMedia(query).matches : false));

  useEffect(() => {
    if (!canMatch()) return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    // Sync when `query` changes (initial state only ran once).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media-query subscription
    setMatches(mql.matches);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** False during SSR and in test environments without `matchMedia` (jsdom). */
function canMatch() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}
