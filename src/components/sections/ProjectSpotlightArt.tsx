import type { PortfolioProject } from '../../data/portfolio';

type ProjectSpotlightArtProps = {
  project: PortfolioProject;
};

/**
 * The spotlight's big visual. Renders the project's real art when the
 * registry has it; otherwise falls back to a typographic tile (project name,
 * large, on an accent-tinted surface) — never a broken image, a placeholder,
 * or generated art.
 *
 * The fallback repeats the project name that's already rendered as a real
 * heading alongside it, so it's marked `aria-hidden` to avoid announcing it
 * twice — the real name lives in `ProjectSpotlight`'s `.spotlight__meta`.
 */
export function ProjectSpotlightArt({ project }: ProjectSpotlightArtProps) {
  if (project.art) {
    return (
      <div className="spotlight__art">
        <img src={project.art.src} alt={project.art.alt} loading="eager" />
      </div>
    );
  }

  return (
    <div className="spotlight__art spotlight__art--type" aria-hidden="true">
      <span className="spotlight__art-name">{project.name}</span>
    </div>
  );
}
