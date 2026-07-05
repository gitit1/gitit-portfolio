// Build-time generator: writes public/llms.txt and public/resume.json from the
// single source of truth in src/data. Run via the `prebuild` npm script (tsx).
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { toLlmsTxt, toJsonResume } from '../src/data/resume.ts';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, '..', 'public');

async function main() {
  await mkdir(publicDir, { recursive: true });
  await writeFile(join(publicDir, 'llms.txt'), toLlmsTxt(), 'utf8');
  await writeFile(
    join(publicDir, 'resume.json'),
    JSON.stringify(toJsonResume(), null, 2),
    'utf8'
  );
  // eslint-disable-next-line no-console
  console.log('Generated public/llms.txt and public/resume.json');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
