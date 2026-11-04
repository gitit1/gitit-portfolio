import { useEffect, useState, type MouseEvent } from 'react';

/**
 * Minimal pathname router (project pages, wave 1, 2026-11-04).
 *
 * The site has exactly two kinds of screen: the one-page home (every
 * section, reached by `#hash` anchors) and a small marketing page per
 * project at a plain path (`/wildhearth`, `/friends-world`). That is not
 * worth a router dependency: this hook reads `location.pathname`, listens to
 * `popstate` for Back/Forward, and `navigate()` pushes a new entry and tells
 * every subscriber. Unknown paths are left alone on purpose: App renders the
 * home page for them exactly as it did before routing existed.
 *
 * Server side, `server/index.ts` already serves `index.html` for any
 * extensionless path, and the build emits `build/<slug>/index.html` (same
 * app shell, page-specific <title>/og tags — see
 * scripts/generate-project-meta.mts) so a shared link previews correctly.
 */

const ROUTE_EVENT = 'gr:navigate';

function currentPath(): string {
  if (typeof window === 'undefined') return '/';
  // Treat `/wildhearth/` and `/wildhearth` as the same page.
  const p = window.location.pathname.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

/** Push a same-origin path (optionally with `#hash`) and re-render subscribers. */
export function navigate(to: string): void {
  const url = new URL(to, window.location.href);
  const samePath = url.pathname === window.location.pathname;
  window.history.pushState({}, '', url.pathname + url.search + url.hash);
  window.dispatchEvent(new Event(ROUTE_EVENT));
  if (url.hash) {
    // Wait for the destination to render before scrolling to its anchor.
    const id = decodeURIComponent(url.hash.slice(1));
    const tryScroll = (attempt: number) => {
      const el = document.getElementById(id);
      // 'instant', not 'auto': html has `scroll-behavior: smooth`, which
      // 'auto' would inherit and animate across a whole new page.
      if (el) el.scrollIntoView({ behavior: samePath ? 'smooth' : 'instant', block: 'start' });
      else if (attempt < 20) window.setTimeout(() => tryScroll(attempt + 1), 50);
    };
    window.setTimeout(() => tryScroll(0), 0);
  } else if (!samePath) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}

/**
 * onClick handler for an in-site `<a href="/...">`: keeps the real href (so
 * middle-click, copy-link and no-JS still work) but swaps the full reload for
 * a client-side navigation on a plain left click.
 */
export function onInternalLinkClick(e: MouseEvent<HTMLAnchorElement | SVGAElement>): void {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return;
  }
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('/')) return;
  e.preventDefault();
  navigate(href);
}

export function usePathname(): string {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const update = () => setPath(currentPath());
    window.addEventListener('popstate', update);
    window.addEventListener(ROUTE_EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(ROUTE_EVENT, update);
    };
  }, []);
  return path;
}
