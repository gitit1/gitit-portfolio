import clsx from 'clsx';
import { SECTIONS, type SectionId } from '../../config/sections';
import { useLang } from '../../i18n/LanguageContext';

type ScrollRailProps = {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
};

export function ScrollRail({ active, onNavigate }: ScrollRailProps) {
  const { t } = useLang();
  return (
    <nav className="rail" aria-label="Scroll progress">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          className={clsx('rail__dot', active === s.id && 'rail__dot--active')}
          data-label={t(`navShort.${s.id}`)}
          aria-label={`${t('goTo')} ${t(`nav.${s.id}`)}`}
          aria-current={active === s.id ? 'true' : undefined}
          onClick={() => onNavigate(s.id)}
        />
      ))}
    </nav>
  );
}
