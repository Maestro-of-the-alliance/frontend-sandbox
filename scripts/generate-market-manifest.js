#!/usr/bin/env node
/**
 * generate-market-manifest.js
 *
 * Scans market-images/<category-folder>/ and writes
 * market-images/manifest.json -- the file the storefront (/market/)
 * actually reads at runtime to know what categories and images exist,
 * since a static site has no way to ask a browser "what files are in
 * this folder" on its own.
 *
 * Run automatically by .github/workflows/market-manifest.yml on every
 * push that touches market-images/**, so the real workflow is: drop
 * an image in the right category subfolder, push, and the manifest
 * (and therefore the live site) updates on its own. Nobody should
 * ever need to run this by hand -- but it's safe to if needed:
 *
 *   node scripts/generate-market-manifest.js
 *
 * Category folders become categories automatically -- add a new
 * subfolder under market-images/ and it just shows up as a new
 * category next run, no code changes needed anywhere. The category's
 * display label is auto-derived from the folder name (title-cased,
 * hyphens/underscores become spaces) -- to override that (e.g. so
 * "t-shirts" displays as "T-Shirts" instead of "T Shirts"), add a
 * file named _label.txt inside that category folder containing the
 * exact label to use.
 *
 * Image ordering within a category is alphabetical by filename.
 * Prefix filenames with numbers (01-thing.jpg, 02-other.jpg) for
 * manual ordering control.
 *
 * A per-image caption is optional: a sidecar text file with the same
 * name as the image (foo.jpg + foo.txt, one line of plain text) is
 * picked up as that image's caption. No sidecar -- no caption, the
 * viewer just shows the image with a title derived from the filename.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const MARKET_DIR = path.join(__dirname, "..", "market-images");
const MANIFEST_PATH = path.join(MARKET_DIR, "manifest.json");
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

function readCaption(categoryDir, imageFilename) {
  const base = imageFilename.slice(0, imageFilename.lastIndexOf("."));
  const sidecarPath = path.join(categoryDir, base + ".txt");
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
  if (!fs.existsSync(MARKET_DIR)) {
    console.error(`market-images/ not found at ${MARKET_DIR}`);
    process.exit(1);
  }

  const categoryFolders = fs
    .readdirSync(MARKET_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const categories = categoryFolders.map((slug) => {
    const categoryDir = path.join(MARKET_DIR, slug);
    const labelOverridePath = path.join(categoryDir, "_label.txt");
    const label = fs.existsSync(labelOverridePath)
      ? fs.readFileSync(labelOverridePath, "utf8").trim()
      : titleCase(slug);
    const files = fs
      .readdirSync(categoryDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const images = files.map((filename) => {
      const base = filename.slice(0, filename.lastIndexOf("."));
      const caption = readCaption(categoryDir, filename);
      return {
        file: filename,
        title: titleCase(base.replace(/^\d+[-_]?/, "")), // strip a leading ordering number like "01-" from the display title
        caption: caption || null,
      };
    });

    return {
      slug,
      label,
      count: images.length,
      images,
    };
  });

  const manifest = {
    generatedAt: new Date().toISOString(),
    categories,
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `Wrote ${MANIFEST_PATH} -- ${categories.length} categories, ` +
      `${categories.reduce((sum, c) => sum + c.count, 0)} images total.`,
  );
}

main();
