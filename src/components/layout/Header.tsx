import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { FiGithub, FiLinkedin, FiMail, FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';
import { SECTIONS, type SectionId } from '../../config/sections';
import { profile } from '../../data/profile';
import type { Theme } from '../../hooks/useTheme';
import { useLang } from '../../i18n/LanguageContext';

type HeaderProps = {
  active: SectionId;
  theme: Theme;
  onToggleTheme: () => void;
  onNavigate: (id: SectionId) => void;
  onAskAi: () => void;
};

export function Header({ active, theme, onToggleTheme, onNavigate, onAskAi }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, toggleLang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: SectionId) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <header className={clsx('header', scrolled && 'header--scrolled')}>
      <div className="container header__inner">
        {/* No aria-label here on purpose: the two child spans (name + role)
            already give this button a real accessible name computed from
            its own visible content, so an aria-label would only risk a
            label-content-name-mismatch (the visible text renders as two
            lines; an aria-label can't reliably reproduce that verbatim). */}
        <button className="brand" onClick={() => go('home')}>
          <span className="brand__name">{profile.name}</span>
          <span className="brand__role">{profile.title}</span>
        </button>

        <nav className={clsx('nav', menuOpen && 'nav--open')} aria-label="Sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={clsx('nav__link', active === s.id && 'nav__link--active')}
              onClick={() => go(s.id)}
            >
              {t(`nav.${s.id}`)}
            </button>
          ))}
          <button className="nav__link nav__desktop-only" onClick={onAskAi}>
            {t('askAi')}
          </button>
        </nav>

        <div className="header__actions">
          <a
            className="icon-btn nav__desktop-only"
            href={profile.links.github.href}
            target="_blank"
            rel="noreferrer"
            aria-label={t('socials.github')}
          >
            <FiGithub />
          </a>
          <a
            className="icon-btn nav__desktop-only"
            href={profile.links.linkedin.href}
            target="_blank"
            rel="noreferrer"
            aria-label={t('socials.linkedin')}
          >
            <FiLinkedin />
          </a>
          <a
            className="icon-btn nav__desktop-only"
            href={profile.links.email.href}
            aria-label={t('socials.email')}
          >
            <FiMail />
          </a>
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t('themeToggle.toLight') : t('themeToggle.toDark')}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button
            className="icon-btn lang-toggle"
            onClick={toggleLang}
            aria-label={`${t('langToggle.label')} — ${t('langToggle.ariaLabel')}`}
          >
            {t('langToggle.label')}
          </button>
          <button
            className="icon-btn nav__toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t('menu')}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
