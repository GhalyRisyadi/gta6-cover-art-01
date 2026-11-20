// Deterministic make.fun handoff: package the offline art studio and let the kit
// produce the scorer-facing dossier. This file intentionally uses only Node APIs.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-app.ts';

const projectDirectory = fileURLToPath(new URL('.', import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const fromProject = (...parts: string[]) => join(projectDirectory, ...parts);
const toOutput = (...parts: string[]) => join(destination, ...parts);

mkdirSync(destination, { recursive: true });
cpSync(fromProject('app'), toOutput('app'), { recursive: true });
if (existsSync(fromProject('screenshots'))) cpSync(fromProject('screenshots'), toOutput('screenshots'), { recursive: true });
else mkdirSync(toOutput('screenshots'), { recursive: true });

const constraints = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
};
writeFileSync(toOutput('dossier.json'), buildDossier(destination, constraints));
