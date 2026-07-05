import { useCallback, useState } from 'react';
import type { SectionId } from './config/sections';
import { useTheme } from './hooks/useTheme';
import { useActiveSection } from './hooks/useActiveSection';
import { useCopyResume } from './hooks/useCopyResume';
import { useCommandPalette } from './hooks/useCommandPalette';
import { Header } from './components/layout/Header';
import { ScrollRail } from './components/layout/ScrollRail';
import { Hero } from './components/sections/Hero';
import { Capabilities } from './components/sections/Capabilities';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { AiNative } from './components/sections/AiNative';
import { Contact } from './components/sections/Contact';
import { AiChat } from './components/chat/AiChat';
import { CommandPalette } from './components/common/CommandPalette';

export default function App() {
  const { theme, toggle } = useTheme();
  const active = useActiveSection();
  const { copied, copy } = useCopyResume();
  const [chatOpen, setChatOpen] = useState(false);

  const scrollTo = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openChat = useCallback(() => setChatOpen(true), []);

  const palette = useCommandPalette({
    onNavigate: scrollTo,
    onToggleTheme: toggle,
    onAskAi: openChat,
    onCopyResume: copy,
  });

  return (
    <>
      <Header
        active={active}
        theme={theme}
        onToggleTheme={toggle}
        onNavigate={scrollTo}
        onAskAi={openChat}
      />
      <ScrollRail active={active} onNavigate={scrollTo} />

      <main>
        <Hero onAskAi={openChat} onCopyResume={copy} copied={copied} />
        <Capabilities />
        <Experience />
        <Projects />
        <AiNative onCopyResume={copy} copied={copied} onAskAi={openChat} />
        <Contact onCopyResume={copy} copied={copied} />
      </main>

      <AiChat open={chatOpen} onClose={() => setChatOpen(false)} onOpen={openChat} />
      <CommandPalette {...palette} />
    </>
  );
}
