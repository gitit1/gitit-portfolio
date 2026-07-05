import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi';
import { Section, revealItem } from '../common/Section';
import { projects, categoryMeta, type Project } from '../../data/projects';

import 'swiper/css';
import 'swiper/css/pagination';

function projectImages(project: Project): string[] {
  return Array.from(
    { length: project.images },
    (_, idx) =>
      new URL(
        `../../styles/assets/projects/${project.imagesName}/${idx + 1}.${project.imagesType}`,
        import.meta.url
      ).href
  );
}

function logoUrl(project: Project): string {
  return new URL(
    `../../styles/assets/projects/${project.imagesName}/logo.png`,
    import.meta.url
  ).href;
}

export function Projects() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work — with more AI builds landing soon."
      lead="A snapshot of what I've shipped. My Homebase suite of AI-built apps is being added here next."
    >
      <div className="proj-grid">
        {projects.map((project) => (
          <motion.button
            key={project.name}
            className="proj-card"
            variants={revealItem}
            onClick={() => setOpenProject(project)}
            aria-label={`Open ${project.name}`}
          >
            <div className="proj-card__head">
              <span className="proj-card__cat">{categoryMeta[project.category].label}</span>
              {project.builtWith === 'claude-code' && (
                <span className="proj-card__badge">built with Claude Code</span>
              )}
              {project.year && <span className="proj-card__year">{project.year}</span>}
            </div>
            <h3 className="proj-card__name">{project.name}</h3>
            <p className="proj-card__summary">{project.summary}</p>
            <div className="proj-card__tech">
              {project.technologies.slice(0, 4).map((t) => (
                <span key={t} className="tech-chip">
                  {t}
                </span>
              ))}
            </div>
            <span className="proj-card__more">View details →</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openProject && (
          <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
        )}
      </AnimatePresence>
    </Section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [zoom, setZoom] = useState<string | null>(null);
  const images = projectImages(project);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 140, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close icon-btn" onClick={onClose} aria-label="Close">
          <FiX />
        </button>

        <div className="modal__head">
          <div>
            <span className="proj-card__cat">{categoryMeta[project.category].label}</span>
            {project.useLogoAsName ? (
              <img className="modal__logo" src={logoUrl(project)} alt={project.name} />
            ) : (
              <h3 className="modal__title">{project.name}</h3>
            )}
          </div>
          <div className="modal__links">
            <a className="btn btn--ghost" href={project.link} target="_blank" rel="noreferrer">
              <FiExternalLink aria-hidden="true" /> Live
            </a>
            {project.gitLink && (
              <a className="btn btn--ghost" href={project.gitLink} target="_blank" rel="noreferrer">
                <FiGithub aria-hidden="true" /> Source
              </a>
            )}
          </div>
        </div>

        <div className="modal__body">
          <div className="modal__desc">
            {project.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="modal__lists">
            <div>
              <h4>Features</h4>
              <ul>
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Built with</h4>
              <ul>
                {project.technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {project.other && (
                <div className="modal__other">
                  {project.other.map(([href, label]) => (
                    <a key={href} className="text-link" href={href} target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div className="modal__gallery">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              slidesPerView={1.15}
              spaceBetween={14}
              breakpoints={{ 640: { slidesPerView: 2.2 }, 960: { slidesPerView: 3.2 } }}
            >
              {images.map((src, idx) => (
                <SwiperSlide key={src}>
                  <button className="thumb" onClick={() => setZoom(src)}>
                    <img src={src} alt={`${project.name} screen ${idx + 1}`} loading="lazy" />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <AnimatePresence>
          {zoom && (
            <motion.div
              className="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoom(null)}
            >
              <img src={zoom} alt="" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
