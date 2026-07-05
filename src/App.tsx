import { useRef, useState, useEffect } from 'react';
import Header, { NavSection } from './components/layout/Header';
import { Section } from './components/common/Section';
import Hero from './components/sections/Hero';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import SectionDots from './components/layout/SectionDots';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, EffectCreative } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';

import 'swiper/css';
import 'swiper/css/effect-creative';

type SectionRefMap = Record<string, HTMLElement | null>;

const sections: NavSection[] = [
  { id: 'home', label: 'Home' },
  { id: 'resume', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

function App() {
  const [activeId, setActiveId] = useState('home');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('gr-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('gr-theme', theme);
  }, [theme]);

  const handleNavigate = (id: string) => {
    const index = sections.findIndex((s) => s.id === id);
    if (index >= 0) swiperRef.current?.slideTo(index);
  };

  return (
    <div className="app-shell">
      <Header
        sections={sections}
        activeId={activeId}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      <SectionDots sections={sections} activeId={activeId} onNavigate={handleNavigate} />
      <main className="snap-container">
        <Swiper
          direction="vertical"
          mousewheel
          effect="creative"
          creativeEffect={{
            prev: {
              translate: [0, -80, -200],
              opacity: 0.55,
              rotate: [8, 0, 0],
              scale: 0.92,
            },
            next: {
              translate: [0, 80, -200],
              opacity: 0.55,
              rotate: [-8, 0, 0],
              scale: 0.92,
            },
          }}
          modules={[Mousewheel, EffectCreative]}
          className="main-swiper"
          speed={850}
          onSlideChange={(slide) => setActiveId(sections[slide.activeIndex].id)}
          onSwiper={(instance) => (swiperRef.current = instance)}
        >
          <SwiperSlide>
            <Section id="home" title="Gitit Regev" kicker="Home" hideTitle activeId={activeId}>
              <Hero />
            </Section>
          </SwiperSlide>
          <SwiperSlide>
            <Section id="resume" title="Experience" kicker="Recent roles" activeId={activeId}>
              <Experience />
            </Section>
          </SwiperSlide>
          <SwiperSlide>
            <Section id="projects" title="Projects" kicker="Selected work" activeId={activeId}>
              <Projects />
            </Section>
          </SwiperSlide>
          <SwiperSlide>
            <Section id="contact" title="Let’s Talk" kicker="Contact" activeId={activeId}>
              <Contact />
            </Section>
          </SwiperSlide>
        </Swiper>
      </main>
      <div className="floating-pill">
        <span>AI search hook is ready — plug your bot here.</span>
      </div>
    </div>
  );
}

export default App;
