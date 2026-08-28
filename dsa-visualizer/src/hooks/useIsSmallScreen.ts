import { useState, useEffect } from 'react';

const QUERY = '(max-width: 767px)';

/**
 * Tracks whether the viewport is phone-sized. Read synchronously on first
 * render so the sidebar never flashes open before collapsing.
 */
export function useIsSmallScreen(): boolean {
  const [isSmall, setIsSmall] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isSmall;
}
