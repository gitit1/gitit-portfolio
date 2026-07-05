import clsx from 'clsx';
import { SECTIONS, type SectionId } from '../../config/sections';

type ScrollRailProps = {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
};

export function ScrollRail({ active, onNavigate }: ScrollRailProps) {
  return (
    <nav className="rail" aria-label="Scroll progress">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          className={clsx('rail__dot', active === s.id && 'rail__dot--active')}
          data-label={s.short}
          aria-label={`Go to ${s.label}`}
          aria-current={active === s.id ? 'true' : undefined}
          onClick={() => onNavigate(s.id)}
        />
      ))}
    </nav>
  );
}
