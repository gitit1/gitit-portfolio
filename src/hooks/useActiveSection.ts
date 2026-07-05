import { useEffect, useState } from 'react';
import { SECTIONS, type SectionId } from '../config/sections';

/**
 * Tracks which section is currently in view via IntersectionObserver.
 * Returns the id of the section whose top is nearest the viewport top band.
 */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('home');

  useEffect(() => {
    const visibility = new Map<SectionId, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id as SectionId, entry.intersectionRatio);
        }
        let best: SectionId = 'home';
        let bestRatio = -1;
        for (const { id } of SECTIONS) {
          const ratio = visibility.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (bestRatio > 0) setActive(best);
      },
      { threshold: [0.15, 0.35, 0.55, 0.75], rootMargin: '-20% 0px -35% 0px' }
    );

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}
