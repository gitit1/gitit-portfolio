import { useState } from 'react';
import clsx from 'clsx';
import { portfolio, resolveTarget } from '../../data/portfolio';

// The Projects section's second door: a capability constellation next to the
// index grid (Projects.tsx). Bipartite graph — 4 project nodes, one node per
// unique capability the registry actually lists (data/portfolio-content.ts),
// edges wherever a project exercises that capability. Shared capability
// strings (e.g. "TypeScript") land on ONE node with multiple edges — that's
// the payoff: hovering it shows which of the four projects it runs through.
//
// Layout is entirely deterministic, computed once at module scope from the
// static `portfolio` import: plain arithmetic, a fixed 30-iteration pairwise
// separation pass (not a physics sim, no runtime loop) — no randomness and
// no clock reads anywhere. Same input -> byte-identical output every reload.

const VIEW_W = 400;
const VIEW_H = 540;
const PAD = 38;
const PROJECT_R = 15;
const CAP_R = 4.5;
const MIN_DIST = 56;
const RELAX_ITERATIONS = 30;
const SINGLETON_PUSH = 92;

// Four fixed, hand-chosen anchors spread as a wide rhombus (top / right /
// bottom / left) inside the portrait viewBox — these never move; capability
// nodes get pushed around them, not the other way round.
const PROJECT_ANCHORS: Record<string, { x: number; y: number }> = {
  wildhearth: { x: 200, y: 104 },
  mfl: { x: 336, y: 262 },
  'assaf-friends-games': { x: 200, y: 436 },
  homebase: { x: 64, y: 262 },
};

type LayoutNode = {
  id: string;
  kind: 'project' | 'cap';
  label: string;
  x: number;
  y: number;
  fixed: boolean;
};

type GraphEdge = { from: string; cap: string };

type Graph = {
  capNodes: LayoutNode[];
  edges: GraphEdge[];
  positions: Map<string, LayoutNode>;
};

/**
 * Deterministic string hash (djb2-style) used only to vary the fan-out angle
 * of singleton capability nodes — never for randomness or timing, just a
 * stable number derived from the capability's own name.
 */
function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function clampToViewBox(node: LayoutNode): void {
  node.x = Math.min(VIEW_W - PAD, Math.max(PAD, node.x));
  node.y = Math.min(VIEW_H - PAD, Math.max(PAD, node.y));
}

function buildGraph(): Graph {
  const projectNodes: LayoutNode[] = portfolio.map((project) => {
    const anchor = PROJECT_ANCHORS[project.slug] ?? { x: VIEW_W / 2, y: VIEW_H / 2 };
    return {
      id: `project:${project.slug}`,
      kind: 'project',
      label: project.name,
      x: anchor.x,
      y: anchor.y,
      fixed: true,
    };
  });

  const centerX = projectNodes.reduce((sum, node) => sum + node.x, 0) / projectNodes.length;
  const centerY = projectNodes.reduce((sum, node) => sum + node.y, 0) / projectNodes.length;

  // Unique capability names in first-appearance order across the registry
  // (registry order, not alphabetical, not random) — stable across reloads.
  const capNames: string[] = [];
  const capToSlugs = new Map<string, string[]>();
  const edges: GraphEdge[] = [];
  portfolio.forEach((project) => {
    project.capabilities.forEach((capability) => {
      if (!capToSlugs.has(capability)) {
        capToSlugs.set(capability, []);
        capNames.push(capability);
      }
      capToSlugs.get(capability)!.push(project.slug);
      edges.push({ from: project.slug, cap: capability });
    });
  });

  const capNodes: LayoutNode[] = capNames.map((name) => {
    const slugs = capToSlugs.get(name) ?? [];
    const anchors = slugs
      .map((slug) => PROJECT_ANCHORS[slug])
      .filter((anchor): anchor is { x: number; y: number } => Boolean(anchor));

    if (anchors.length > 1) {
      // Shared capability: starts at the centroid of the projects it
      // connects — already "between" them before relaxation nudges it clear.
      const x = anchors.reduce((sum, a) => sum + a.x, 0) / anchors.length;
      const y = anchors.reduce((sum, a) => sum + a.y, 0) / anchors.length;
      const node: LayoutNode = { id: `cap:${name}`, kind: 'cap', label: name, x, y, fixed: false };
      clampToViewBox(node);
      return node;
    }

    // Singleton: pushed outward from the graph's center, beyond its one
    // project, along a radial angle nudged by a deterministic hash of the
    // capability's name — so several singletons on the same project fan out
    // instead of stacking on a single ray.
    const anchor = anchors[0] ?? { x: centerX, y: centerY };
    const baseAngle = Math.atan2(anchor.y - centerY, anchor.x - centerX);
    const offsetDeg = (hashString(name) % 71) - 35; // -35..+35 degrees, deterministic
    const angle = baseAngle + (offsetDeg * Math.PI) / 180;
    const radius = Math.hypot(anchor.x - centerX, anchor.y - centerY) + SINGLETON_PUSH;
    const node: LayoutNode = {
      id: `cap:${name}`,
      kind: 'cap',
      label: name,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      fixed: false,
    };
    clampToViewBox(node);
    return node;
  });

  // Fixed-iteration, deterministic pairwise relaxation: nudge any two nodes
  // closer than MIN_DIST apart, iterating in stable array order (projects
  // first, then capabilities in first-appearance order) each pass. Project
  // anchors are `fixed` — capability nodes get pushed away from them, but
  // the anchors themselves never move, so the hand-chosen rhombus holds.
  const allNodes = [...projectNodes, ...capNodes];
  for (let iter = 0; iter < RELAX_ITERATIONS; iter += 1) {
    for (let i = 0; i < allNodes.length; i += 1) {
      for (let j = i + 1; j < allNodes.length; j += 1) {
        const a = allNodes[i];
        const b = allNodes[j];
        if (a.fixed && b.fixed) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        if (dist >= MIN_DIST) continue;
        const overlap = MIN_DIST - dist;
        const ux = dx / dist;
        const uy = dy / dist;
        if (!a.fixed && !b.fixed) {
          a.x -= (ux * overlap) / 2;
          a.y -= (uy * overlap) / 2;
          b.x += (ux * overlap) / 2;
          b.y += (uy * overlap) / 2;
        } else if (a.fixed) {
          b.x += ux * overlap;
          b.y += uy * overlap;
        } else {
          a.x -= ux * overlap;
          a.y -= uy * overlap;
        }
        if (!a.fixed) clampToViewBox(a);
        if (!b.fixed) clampToViewBox(b);
      }
    }
  }

  const positions = new Map<string, LayoutNode>();
  allNodes.forEach((node) => positions.set(node.id, node));

  return { capNodes, edges, positions };
}

// Computed once, at module evaluation — every render reads the same frozen
// layout, no recomputation, no drift.
const GRAPH = buildGraph();

export type ProjectsGraphProps = {
  hoverSlug: string | null;
  onHoverSlug: (slug: string | null) => void;
};

type Hover = { kind: 'project' | 'cap'; key: string } | null;

/**
 * The capability constellation. Purely decorative to assistive tech (the
 * index grid is the accessible door — see Projects.tsx): the <svg> carries
 * aria-hidden, and every interactive element inside it (only the project
 * anchors, when they resolve to a real link) carries tabIndex={-1} so
 * nothing here ever enters the tab order.
 */
export function ProjectsGraph({ hoverSlug, onHoverSlug }: ProjectsGraphProps) {
  const [internalHover, setInternalHover] = useState<Hover>(null);
  // Internal (mouse-over-the-graph) hover wins; otherwise an externally
  // hovered index card highlights its project node exactly as if hovered
  // directly.
  const effective: Hover = internalHover ?? (hoverSlug ? { kind: 'project', key: hoverSlug } : null);

  const litProjects = new Set<string>();
  const litCaps = new Set<string>();
  if (effective) {
    if (effective.kind === 'project') {
      litProjects.add(effective.key);
      GRAPH.edges.forEach((edge) => {
        if (edge.from === effective.key) litCaps.add(edge.cap);
      });
    } else {
      litCaps.add(effective.key);
      GRAPH.edges.forEach((edge) => {
        if (edge.cap === effective.key) litProjects.add(edge.from);
      });
    }
  }

  const projectHighlight = (slug: string) =>
    effective ? (litProjects.has(slug) ? 'is-lit' : 'is-dim') : undefined;
  const capHighlight = (name: string) => (effective ? (litCaps.has(name) ? 'is-lit' : 'is-dim') : undefined);
  const edgeHighlight = (edge: GraphEdge) => {
    if (!effective) return undefined;
    const lit = effective.kind === 'project' ? edge.from === effective.key : edge.cap === effective.key;
    return lit ? 'is-lit' : 'is-dim';
  };

  const handleProjectEnter = (slug: string) => {
    setInternalHover({ kind: 'project', key: slug });
    onHoverSlug(slug);
  };
  const handleProjectLeave = () => {
    setInternalHover(null);
    onHoverSlug(null);
  };
  const handleCapEnter = (name: string) => setInternalHover({ kind: 'cap', key: name });
  const handleCapLeave = () => setInternalHover(null);

  return (
    <div className="projects-graph">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true">
        <g className="projects-graph__edges">
          {GRAPH.edges.map((edge) => {
            const from = GRAPH.positions.get(`project:${edge.from}`);
            const to = GRAPH.positions.get(`cap:${edge.cap}`);
            if (!from || !to) return null;
            return (
              <line
                key={`${edge.from}__${edge.cap}`}
                className={clsx('projects-graph__edge', edgeHighlight(edge))}
                data-from={edge.from}
                data-cap={edge.cap}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              />
            );
          })}
        </g>

        <g className="projects-graph__caps">
          {GRAPH.capNodes.map((node) => (
            <g
              key={node.id}
              className={clsx('projects-graph__node projects-graph__node--cap', capHighlight(node.label))}
              data-cap={node.label}
              onPointerEnter={() => handleCapEnter(node.label)}
              onPointerLeave={handleCapLeave}
            >
              <circle cx={node.x} cy={node.y} r={CAP_R} />
              <text x={node.x} y={node.y - CAP_R - 4} textAnchor="middle">
                {node.label}
              </text>
            </g>
          ))}
        </g>

        <g className="projects-graph__projects">
          {portfolio.map((project) => {
            const node = GRAPH.positions.get(`project:${project.slug}`);
            if (!node) return null;
            const target = resolveTarget(project);
            const className = clsx(
              'projects-graph__node projects-graph__node--project',
              projectHighlight(project.slug)
            );
            const inner = (
              <>
                <circle cx={node.x} cy={node.y} r={PROJECT_R} />
                <text x={node.x} y={node.y + PROJECT_R + 15} textAnchor="middle">
                  {project.name}
                </text>
              </>
            );
            const pointerHandlers = {
              onPointerEnter: () => handleProjectEnter(project.slug),
              onPointerLeave: handleProjectLeave,
            };

            if (target.kind === 'none') {
              // No real destination — a plain group, never a fake affordance.
              return (
                <g key={project.slug} className={className} data-slug={project.slug} {...pointerHandlers}>
                  {inner}
                </g>
              );
            }

            return (
              <a
                key={project.slug}
                className={className}
                data-slug={project.slug}
                href={target.href}
                tabIndex={-1}
                {...(target.kind === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...pointerHandlers}
              >
                {inner}
              </a>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
