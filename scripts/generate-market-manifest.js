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
 * A per-image display title is optional: a sidecar text file with the
 * same name as the image (foo.jpg + foo.txt, one line of plain text)
 * overrides the auto-derived title. No sidecar -- the title falls
 * back to a title-cased version of the filename.
 *
 * Color swatches are optional too, and don't require a separate photo
 * per color: a sidecar file named <image>.colors.txt, one color per
 * line as "Name #hexcode" (e.g. "Black #000000"). The FIRST line is
 * treated as the color actually shown in the photo (gets a ringed
 * swatch in the viewer); every other line is shown as "also available
 * in" with a plain swatch. No sidecar -- no swatches shown at all.
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

const HEX_COLOR_RE = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;

function readColors(categoryDir, imageFilename) {
  const base = imageFilename.slice(0, imageFilename.lastIndexOf("."));
  const sidecarPath = path.join(categoryDir, base + ".colors.txt");
  if (!fs.existsSync(sidecarPath)) return [];
  let raw;
  try {
    raw = fs.readFileSync(sidecarPath, "utf8");
  } catch (e) {
    return [];
  }
  const parsed = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s+/);
      const hex = parts[parts.length - 1];
      const name = parts.slice(0, -1).join(" ");
      if (!name || !HEX_COLOR_RE.test(hex)) {
        console.warn(
          `  warning: skipping malformed color line in ${path.basename(sidecarPath)}: "${line}" (expected "Name #hexcode")`,
        );
        return null;
      }
      return { name, hex };
    })
    .filter(Boolean);
  // "current" (the color actually shown in the photo) is the first
  // VALID entry, determined after filtering out malformed lines --
  // not the first line of the raw file, so a bad first line can't
  // silently leave nothing marked current.
  return parsed.map((color, i) => ({ ...color, current: i === 0 }));
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
      const colors = readColors(categoryDir, filename);
      return {
        file: filename,
        title: caption || titleCase(base.replace(/^\d+[-_]?/, "")), // strip a leading ordering number like "01-" from the display title
        caption: null,
        colors,
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
