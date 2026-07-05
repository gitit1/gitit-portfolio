import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { projects } from '../../data/projects';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Projects = () => {
  const [openImage, setOpenImage] = useState<string | null>(null);

  return (
    <div className="projects">
      {openImage && (
        <dialog className="image-dialog" open onClick={() => setOpenImage(null)}>
          <img src={openImage} alt="" />
        </dialog>
      )}

      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="projects-swiper"
        spaceBetween={32}
      >
        {projects.map((project) => {
          const images = Array.from({ length: project.images }, (_, idx) =>
            new URL(`../../styles/assets/projects/${project.imagesName}/${idx + 1}.${project.imagesType}`, import.meta.url)
              .href
          );

          return (
            <SwiperSlide key={project.name}>
              <motion.div
                className="project-card"
                initial={{ opacity: 0, y: 40, scale: 0.94, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 12, bounce: 0.36 }}
                viewport={{ once: true, amount: 0.35 }}
              >
                <div className="project-card__title">
                  <a href={project.link} target="_blank" rel="noreferrer">
                    {project.useLogoAsName ? (
                      <img
                        src={
                          new URL(`../../styles/assets/projects/${project.imagesName}/logo.png`, import.meta.url).href
                        }
                        alt={project.name}
                      />
                    ) : (
                      <span>{project.name}</span>
                    )}
                  </a>
                  <div className="tag-row">
                    {project.tags?.map(([label, color]) => (
                      <span key={label} className={`tag tag--${color}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="project-card__body">
                  <div className="project-card__description">
                    {project.description.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {project.gitLink && (
                      <a className="text-link" href={project.gitLink} target="_blank" rel="noreferrer">
                        View on GitHub
                      </a>
                    )}
                  </div>
                  <div className="project-card__lists">
                    <div>
                      <h4>Features</h4>
                      <ul>
                        {project.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Technologies</h4>
                      <ul>
                        {project.technologies.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="project-card__gallery">
                  <Swiper
                    modules={[Pagination]}
                    pagination={{ type: 'progressbar' }}
                    slidesPerView={4}
                    spaceBetween={12}
                  >
                    {images.map((imageSrc, idx) => (
                      <SwiperSlide key={`${project.imagesName}-${idx}`}>
                        <button className="thumb" onClick={() => setOpenImage(imageSrc)}>
                          <img src={imageSrc} alt={`${project.name} screen ${idx + 1}`} />
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {project.other && (
                  <div className="project-card__other">
                    {project.other.map(([href, label]) => (
                      <a key={href} href={href} target="_blank" rel="noreferrer" className="text-link">
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Projects;
