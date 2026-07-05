import { ReactNode, forwardRef, useMemo, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

type SectionProps = {
  id: string;
  title: string;
  kicker?: string;
  children: ReactNode;
  hideTitle?: boolean;
  activeId?: string;
};

export const Section = forwardRef<HTMLElement, SectionProps>(({ id, title, kicker, children, hideTitle, activeId }, ref) => (
  <SectionWithMotion id={id} title={title} kicker={kicker} hideTitle={hideTitle} activeId={activeId} ref={ref}>
    {children}
  </SectionWithMotion>
));

Section.displayName = 'Section';

const SectionWithMotion = forwardRef<HTMLElement, SectionProps>(
  ({ id, title, kicker, children, hideTitle, activeId }, ref) => {
    const controls = useAnimationControls();

    useEffect(() => {
      if (activeId === id) {
        controls.start('show');
      } else {
        controls.start('hidden');
      }
    }, [activeId, id, controls]);

    const direction = useMemo(() => {
      switch (id) {
        case 'home':
          return { x: -32, y: 10, rotate: -1.5 };
        case 'resume':
        return { x: 22, y: 26, rotate: 1 };
      case 'projects':
        return { x: -18, y: 30, rotate: -0.8 };
      case 'contact':
        return { x: 14, y: 18, rotate: 1.4 };
      default:
        return { x: 0, y: 24, rotate: 0 };
    }
  }, [id]);

  const containerVariants = {
    hidden: { opacity: 0, x: direction.x, y: direction.y + 12, rotate: direction.rotate - 2, scale: 0.94 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
        bounce: 0.32,
        staggerChildren: 0.12,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 28, rotate: -2, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 130, damping: 12, bounce: 0.4 },
    },
    };

    return (
      <section id={id} className={`section snap-section section--${id}`} ref={ref}>
        <motion.div
          className="section__inner"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {!hideTitle && (
            <motion.div className="section__heading" variants={childVariants}>
              {kicker && <span className="section__kicker">{kicker}</span>}
              <motion.h2 variants={childVariants}>{title}</motion.h2>
          </motion.div>
        )}
        <motion.div className="section__body" variants={childVariants}>
          {children}
        </motion.div>
      </motion.div>
      </section>
    );
  }
);

SectionWithMotion.displayName = 'SectionWithMotion';
