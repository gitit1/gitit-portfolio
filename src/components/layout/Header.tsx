import { useState } from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { FiMoon, FiSun } from 'react-icons/fi';
import clsx from 'clsx';

export type NavSection = {
  id: string;
  label: string;
};

type HeaderProps = {
  sections: NavSection[];
  activeId: string;
  onNavigate: (id: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

const Header = ({ sections, activeId, onNavigate, theme, onToggleTheme }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="brand" onClick={() => onNavigate('home')}>
        <span className="brand__title">Gitit Regev</span>
        <span className="brand__subtitle">Full Stack Developer</span>
      </div>

      <nav className={clsx('nav', { 'nav--open': open })}>
        {sections.map((section) => (
          <button
            key={section.id}
            className={clsx('nav__item', { 'is-active': activeId === section.id })}
            onClick={() => {
              onNavigate(section.id);
              setOpen(false);
            }}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div className="social">
        <a href="mailto:gititregev1@gmail.com" aria-label="Email">
          <FaEnvelope />
        </a>
        <a href="https://www.linkedin.com/in/gitit-regev-aa6a4961/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
        <a href="https://github.com/gitit1?tab=repositories" target="_blank" rel="noreferrer" aria-label="GitHub">
          <FaGithub />
        </a>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
      </div>

      <button
        className={clsx('burger', { 'is-open': open })}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
      </button>
    </header>
  );
};

export default Header;
