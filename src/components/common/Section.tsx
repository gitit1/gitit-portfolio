import { ReactNode } from 'react';
import { motion, MotionConfig } from 'framer-motion';
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

/**
 * A page section that fades + rises its children when scrolled into view.
 *
 * Fail-open by design: the outer <motion.section> never carries opacity/
 * transform of its own (the `container` variant only configures stagger
 * timing), so the section is always visible even if the reveal never fires.
 * The `viewport` threshold below uses `amount: 0` — any intersection at all
 * triggers the reveal — specifically because sections here are allowed to
 * grow taller than the viewport (see .section--page). A fractional amount
 * (e.g. 0.2) is a fraction of the *target's own height*; for a section many
 * viewports tall the visible fraction can never reach that threshold, so it
 * would never fire and the content would stay invisible forever. `amount: 0`
 * has no such ceiling. `MotionConfig reducedMotion="user"` additionally
 * honours prefers-reduced-motion for this whole subtree (including the
 * `revealItem`-based motion elements rendered by individual sections).
 */
export function Section({ id, eyebrow, title, lead, children, className }: SectionProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id={id}
        className={`section section--page${className ? ` ${className}` : ''}`}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
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
    </MotionConfig>
  );
}

/** Convenience wrapper so children can opt into the same stagger animation. */
export const Reveal = motion.div;
export const revealItem = item;
