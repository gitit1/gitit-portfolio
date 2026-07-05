import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { SectionId } from '../../config/sections';

type SectionProps = {
  id: SectionId;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: ReactNode;
  className?: string;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18 },
  },
};

/** A page section that fades + rises its children when scrolled into view. */
export function Section({ id, eyebrow, title, lead, children, className }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={`section${className ? ` ${className}` : ''}`}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container">
        {(eyebrow || title) && (
          <header className="section__head">
            {eyebrow && (
              <motion.div className="section__eyebrow" variants={item}>
                {eyebrow}
              </motion.div>
            )}
            {title && (
              <motion.h2 className="section__title" variants={item}>
                {title}
              </motion.h2>
            )}
            {lead && (
              <motion.p className="section__lead" variants={item}>
                {lead}
              </motion.p>
            )}
          </header>
        )}
        {children}
      </div>
    </motion.section>
  );
}

/** Convenience wrapper so children can opt into the same stagger animation. */
export const Reveal = motion.div;
export const revealItem = item;
