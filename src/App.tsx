import { useCallback, useEffect, useState } from 'react';
import type { SectionId } from './config/sections';
import { useTheme, type Theme } from './hooks/useTheme';
import { useActiveSection } from './hooks/useActiveSection';
import { useCopyResume } from './hooks/useCopyResume';
import { useCommandPalette } from './hooks/useCommandPalette';
import { navigate, usePathname } from './hooks/useRoute';
import { findProjectPage, type ProjectPageId } from './data/project-pages-content';
import { Header } from './components/layout/Header';
import { ScrollRail } from './components/layout/ScrollRail';
import { Hero } from './components/sections/Hero';
import { HowIBuild } from './components/sections/HowIBuild';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { AiNative } from './components/sections/AiNative';
import { Contact } from './components/sections/Contact';
import { ProjectPage } from './components/pages/ProjectPage';
import { AiChat } from './components/chat/AiChat';
import { CommandPalette } from './components/common/CommandPalette';
import { ElectronsField } from './components/common/ElectronsField';

// The home <title> — keep in sync with index.html. A constant, not read from
// the document: a visit that STARTS on a project page loads
// build/<slug>/index.html, whose <title> is the project's own.
const HOME_TITLE = 'Gitit Regev — AI Product Builder';

export default function App() {
  const { theme, toggle } = useTheme();
  const { copied, copy } = useCopyResume();
  const [chatOpen, setChatOpen] = useState(false);
  const path = usePathname();
  // Unknown paths fall through to the home page, exactly as before routing.
  const projectPage = findProjectPage(path);

  useEffect(() => {
    document.title = projectPage ? projectPage.meta.title : HOME_TITLE;
  }, [projectPage]);

  const scrollTo = useCallback(
    (id: SectionId) => {
      if (projectPage) {
        // On a project page the sections live on the home page.
        navigate(id === 'home' ? '/' : `/#${id}`);
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [projectPage]
  );

  const openChat = useCallback(() => setChatOpen(true), []);

  const palette = useCommandPalette({
    onNavigate: scrollTo,
    onToggleTheme: toggle,
    onAskAi: openChat,
    onCopyResume: copy,
  });

  return (
    <>
      <ElectronsField fixed density={0.7} className="site-bg" />

      {projectPage ? (
        <ProjectView
          id={projectPage.id}
          theme={theme}
          onToggleTheme={toggle}
          onNavigate={scrollTo}
          onAskAi={openChat}
        />
      ) : (
        <HomeView
          theme={theme}
          onToggleTheme={toggle}
          onNavigate={scrollTo}
          onAskAi={openChat}
          onCopyResume={copy}
          copied={copied}
        />
      )}

      <AiChat open={chatOpen} onClose={() => setChatOpen(false)} onOpen={openChat} />
      <CommandPalette {...palette} />
    </>
  );
}

type ShellProps = {
  theme: Theme;
  onToggleTheme: () => void;
  onNavigate: (id: SectionId) => void;
  onAskAi: () => void;
};

function HomeView({
  theme,
  onToggleTheme,
  onNavigate,
  onAskAi,
  onCopyResume,
  copied,
}: ShellProps & { onCopyResume: () => void; copied: boolean }) {
  // Lives here (not in App) so its IntersectionObserver attaches to the
  // sections each time the home page mounts, e.g. after coming back from a
  // project page.
  const active = useActiveSection();

  // Arriving with an anchor (a full load of `/#projects`, e.g. from a
  // project page opened in a new tab): the sections only exist after this
  // first render, so the browser's own anchor jump has nothing to land on.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    }, 60);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Header
        active={active}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onNavigate={onNavigate}
        onAskAi={onAskAi}
      />
      <ScrollRail active={active} onNavigate={onNavigate} />

      <main>
        <Hero onAskAi={onAskAi} onCopyResume={onCopyResume} copied={copied} />
        <HowIBuild />
        <Experience />
        <Projects />
        <AiNative onCopyResume={onCopyResume} copied={copied} onAskAi={onAskAi} />
        <Contact onCopyResume={onCopyResume} copied={copied} />
      </main>
    </>
  );
}

function ProjectView({ id, theme, onToggleTheme, onNavigate, onAskAi }: ShellProps & { id: ProjectPageId }) {
  return (
    <>
      <Header
        active="projects"
        theme={theme}
        onToggleTheme={onToggleTheme}
        onNavigate={onNavigate}
        onAskAi={onAskAi}
      />
      <ProjectPage key={id} id={id} />
    </>
  );
}
