import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { FiGithub, FiLinkedin, FiMail, FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';
import { SECTIONS, type SectionId } from '../../config/sections';
import { profile } from '../../data/profile';
import type { Theme } from '../../hooks/useTheme';

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
        <button className="brand" onClick={() => go('home')} aria-label="Go to top">
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
              {s.label}
            </button>
          ))}
          <button className="nav__link nav__desktop-only" onClick={onAskAi}>
            Ask my AI ↗
          </button>
        </nav>

        <div className="header__actions">
          <a
            className="icon-btn nav__desktop-only"
            href={profile.links.github.href}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FiGithub />
          </a>
          <a
            className="icon-btn nav__desktop-only"
            href={profile.links.linkedin.href}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FiLinkedin />
          </a>
          <a
            className="icon-btn nav__desktop-only"
            href={profile.links.email.href}
            aria-label="Email"
          >
            <FiMail />
          </a>
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button
            className="icon-btn nav__toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
