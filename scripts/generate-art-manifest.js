#!/usr/bin/env node
/**
 * generate-art-manifest.js
 *
 * Scans art-images/ (a flat folder -- no category subfolders, unlike
 * the MARKET generator) and writes art-images/manifest.json, which
 * entries/art.html's gallery viewer reads at runtime.
 *
 * Run automatically by .github/workflows/art-manifest.yml on every
 * push that touches art-images/**, so the workflow is: drop a poster
 * image in art-images/, push, and it appears in the gallery. Nobody
 * should ever need to run this by hand, but it's safe to:
 *
 *   node scripts/generate-art-manifest.js
 *
 * Ordering is alphabetical by filename. Prefix filenames with numbers
 * (01-thing.png, 02-other.png) for manual ordering control.
 *
 * A caption/title is optional: a sidecar text file with the same name
 * as the image (foo.png + foo.txt, one line of plain text) becomes
 * that poster's placard title. No sidecar -- the title falls back to
 * a title-cased version of the filename.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ART_DIR = path.join(__dirname, "..", "art-images");
const MANIFEST_PATH = path.join(ART_DIR, "manifest.json");
const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
]);

function titleCase(slug) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function readCaption(imageFilename) {
  const base = imageFilename.slice(0, imageFilename.lastIndexOf("."));
  const sidecarPath = path.join(ART_DIR, base + ".txt");
  if (fs.existsSync(sidecarPath)) {
    try {
      return fs.readFileSync(sidecarPath, "utf8").trim();
    } catch (e) {
      return null;
    }
  }
  return null;
}

function main() {
  if (!fs.existsSync(ART_DIR)) {
    console.error(`art-images/ not found at ${ART_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(ART_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const posters = files.map((filename) => {
    const base = filename.slice(0, filename.lastIndexOf("."));
    const caption = readCaption(filename);
    return {
      file: filename,
      title: caption || titleCase(base.replace(/^\d+[-_]?/, "")),
    };
  });

  const manifest = {
    generatedAt: new Date().toISOString(),
    count: posters.length,
    posters,
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Wrote ${MANIFEST_PATH} -- ${posters.length} posters.`);
}

main();
