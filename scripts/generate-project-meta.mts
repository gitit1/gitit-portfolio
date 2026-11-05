// Post-build: give every project page its own static <head> (wave 1,
// 2026-11-04). Runs via the `postbuild` npm script, after `vite build`.
//
// For each page in src/data/project-pages-content.ts it copies the BUILT
// build/index.html (same hashed JS/CSS, same app shell — the client router
// renders the right page) to build/<path>/index.html with the page's own
// <title>, description, canonical URL and Open Graph / Twitter tags, so a
// shared link to gititregev.com/wildhearth previews as Wildhearth, not as the
// home page. server/index.ts serves build/<path>/index.html for `/<path>`
// and `/<path>/`; any host that serves `dir/index.html` does the same.
//
// The og images are stable files in public/og/ (not hashed assets) so the
// absolute URL in the tag never changes between builds.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// Published pages only (2026-11-05): an unapproved draft gets no static head.
import { publishedProjectPages } from '../src/data/project-pages-content.ts';

const SITE = 'https://gititregev.com';
const here = dirname(fileURLToPath(import.meta.url));
const buildDir = join(here, '..', 'build');

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Replace exactly one match or fail loudly — never a silent no-op. */
function replaceOnce(html: string, pattern: RegExp, replacement: string, what: string): string {
  const matches = html.match(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'));
  if (!matches || matches.length !== 1) {
    throw new Error(`generate-project-meta: expected exactly one ${what} in build/index.html, found ${matches?.length ?? 0}`);
  }
  return html.replace(pattern, replacement);
}

async function main() {
  const shell = await readFile(join(buildDir, 'index.html'), 'utf8');

  for (const page of publishedProjectPages) {
    const url = `${SITE}${page.path}`;
    const title = escapeAttr(page.meta.title);
    const desc = escapeAttr(page.meta.description);
    const image = `${SITE}${page.meta.ogImage}`;
    const alt = escapeAttr(page.meta.ogAlt);

    let html = shell;
    html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, '<title>');
    html = replaceOnce(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${desc}" />`, 'meta description');
    html = replaceOnce(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, 'canonical');
    html = replaceOnce(html, /<meta property="og:type" content="[^"]*" \/>/, '<meta property="og:type" content="article" />', 'og:type');
    html = replaceOnce(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, 'og:url');
    html = replaceOnce(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`, 'og:title');
    html = replaceOnce(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${desc}" />`, 'og:description');
    html = replaceOnce(
      html,
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${image}" />\n    <meta property="og:image:alt" content="${alt}" />`,
      'og:image'
    );
    html = replaceOnce(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`, 'twitter:title');
    html = replaceOnce(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${desc}" />`, 'twitter:description');
    html = replaceOnce(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`, 'twitter:image');

    // Assert the writes really landed (a regex miss would otherwise ship the home <head>).
    for (const needle of [`<title>${title}</title>`, `content="${url}"`, `content="${image}"`]) {
      if (!html.includes(needle)) throw new Error(`generate-project-meta: ${page.path} is missing ${needle}`);
    }

    const outDir = join(buildDir, page.path.replace(/^\//, ''));
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'index.html'), html, 'utf8');
    // eslint-disable-next-line no-console
    console.log(`Generated build${page.path}/index.html`);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
