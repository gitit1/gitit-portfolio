// The aggregator: turns the structured data (profile, skills, experience,
// projects) into every derived representation the site needs.
//
// IMPORTANT: keep this file and everything it imports Node-safe — no browser
// globals, no `import.meta`, no asset imports. It runs in the browser (copy
// button), in Vercel serverless functions (chat, mcp, resume.json) and in the
// build script (llms.txt).

import { profile } from './profile';
import { capabilities, groupMeta, type CapabilityGroup } from './skills';
import { experiences } from './experience';
// Node-safe content only (no asset imports) — see portfolio-content.ts's
// header comment for why this file can't import from portfolio.ts.
import { portfolioContent as portfolio } from './portfolio-content';

const groupOrder: CapabilityGroup[] = ['ai', 'engineering', 'product'];

/** Full resume as Markdown — the canonical human+LLM readable document. */
export function buildMarkdownResume(): string {
  const lines: string[] = [];

  lines.push(`# ${profile.name}`);
  lines.push(`**${profile.title}** — ${profile.tagline}`);
  lines.push('');
  lines.push(profile.summary);
  lines.push('');
  lines.push('## Contact');
  lines.push(`- Location: ${profile.location}`);
  lines.push(`- Email: ${profile.email}`);
  lines.push(`- LinkedIn: ${profile.links.linkedin.href}`);
  lines.push(`- GitHub: ${profile.links.github.href}`);
  lines.push('');

  lines.push('## What I bring');
  for (const group of groupOrder) {
    const meta = groupMeta[group];
    lines.push(`### ${meta.label} — ${meta.tagline}`);
    for (const cap of capabilities.filter((c) => c.group === group)) {
      lines.push(`- **${cap.name}:** ${cap.blurb}`);
    }
    lines.push('');
  }

  lines.push('## Experience');
  for (const exp of experiences) {
    const link = exp.link ? ` (${exp.link})` : '';
    lines.push(`### ${exp.role} — ${exp.company}${link}`);
    lines.push(`*${exp.period}*`);
    for (const bullet of exp.bullets) lines.push(`- ${bullet}`);
    lines.push('');
  }

  lines.push('## Projects');
  for (const p of portfolio) {
    const link = p.externalLink ? ` — ${p.externalLink}` : '';
    lines.push(`### ${p.name} (${p.year})${link}`);
    lines.push(p.tagline);
    lines.push(`- Status: ${p.stateLabel}`);
    lines.push('');
  }

  return lines.join('\n').trim() + '\n';
}

/** System prompt for the "Ask my AI about me" chat — persona + grounding. */
export function buildChatSystemPrompt(): string {
  return [
    `You are the AI assistant embedded on ${profile.name}'s personal portfolio site.`,
    `You speak on her behalf to visitors — recruiters, hiring managers, engineers and the curious.`,
    '',
    'Rules:',
    `- Answer ONLY using the resume below. If asked something it does not cover, say you do not have that detail and suggest reaching out via the Contact section.`,
    '- Refer to Gitit in the third person ("Gitit built…", "she works…"). You are her assistant, not her.',
    '- Be concise and warm. Prefer 2-4 sentences. Use short bullet lists only when genuinely helpful.',
    '- Never invent employers, dates, salaries, or facts not present below.',
    '- If someone wants to hire or collaborate, encourage them to use the Contact section (email or LinkedIn).',
    '- Politely decline anything unrelated to Gitit, her work, or her skills.',
    '',
    '=== RESUME ===',
    buildMarkdownResume(),
    '=== END RESUME ===',
  ].join('\n');
}

/** JSON Resume (https://jsonresume.org) representation. */
export function toJsonResume() {
  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: profile.name,
      label: profile.title,
      email: profile.email,
      summary: profile.summary,
      location: { region: profile.location },
      profiles: [
        {
          network: 'LinkedIn',
          username: profile.links.linkedin.handle,
          url: profile.links.linkedin.href,
        },
        {
          network: 'GitHub',
          username: profile.links.github.handle,
          url: profile.links.github.href,
        },
      ],
    },
    work: experiences.map((exp) => ({
      name: exp.company,
      position: exp.role,
      url: exp.link,
      startDate: exp.period,
      highlights: exp.bullets,
    })),
    projects: portfolio.map((p) => ({
      name: p.name,
      description: p.tagline,
      highlights: [p.stateLabel],
      startDate: p.year,
      ...(p.externalLink ? { url: p.externalLink } : {}),
    })),
    skills: groupOrder.map((group) => ({
      name: groupMeta[group].label,
      keywords: capabilities.filter((c) => c.group === group).map((c) => c.name),
    })),
    meta: {
      canonical: profile.site.resumeJson,
      mcp: profile.site.mcpUrl,
      version: '1.0.0',
    },
  };
}

/** llms.txt (https://llmstxt.org) — a machine-readable site guide for LLMs. */
export function toLlmsTxt(): string {
  const projectLinks = portfolio
    .map((p) =>
      p.externalLink
        ? `- [${p.name}](${p.externalLink}): ${p.tagline} (${p.stateLabel})`
        : `- ${p.name}: ${p.tagline} (${p.stateLabel})`
    )
    .join('\n');

  return [
    `# ${profile.name}`,
    '',
    `> ${profile.blurb}`,
    '',
    profile.summary,
    '',
    '## Machine-readable resume',
    `- [Full resume (JSON Resume)](${profile.site.resumeJson}): structured resume data`,
    `- [MCP server](${profile.site.mcpUrl}): connect an agent to query her resume, experience and projects`,
    '',
    '## Projects',
    projectLinks,
    '',
    '## Contact',
    `- [LinkedIn](${profile.links.linkedin.href})`,
    `- [GitHub](${profile.links.github.href})`,
    `- Email: ${profile.email}`,
    '',
  ].join('\n');
}
