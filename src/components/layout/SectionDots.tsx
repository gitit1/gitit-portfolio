import clsx from 'clsx';
import { NavSection } from './Header';

type Props = {
  sections: NavSection[];
  activeId: string;
  onNavigate: (id: string) => void;
};

const SectionDots = ({ sections, activeId, onNavigate }: Props) => (
  <div className="section-dots">
    {sections.map((section) => (
      <button
        key={section.id}
        className={clsx('section-dots__dot', { 'is-active': activeId === section.id })}
        onClick={() => onNavigate(section.id)}
        aria-label={`Go to ${section.label}`}
      />
    ))}
  </div>
);

export default SectionDots;
