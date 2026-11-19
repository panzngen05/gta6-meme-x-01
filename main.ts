// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: a GTA 6 meme posted from a public account
// with make.fun (link and/or @makefunai tag) and a play code in its text.
// This program only hands the post's address to the gate: it reads POST.json
// from the repository root, checks it names a real X status URL, and writes
// it to the output directory where the gate reads it.
//
// Run locally to test:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const src = join(BOT_DIR, 'POST.json');
let post: unknown;
try {
  post = JSON.parse(readFileSync(src, 'utf8'));
} catch (err) {
  console.error(`Could not read ${src}: ${(err as Error).message}`);
  process.exit(1);
}

const url = (post as { url?: unknown })?.url;
if (typeof url !== 'string' || !/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(url)) {
  console.error(`POST.json must name a real X post URL, got: ${JSON.stringify(url)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'POST.json'), JSON.stringify({ url }) + '\n');
console.log(`Entry post: ${url}`);
