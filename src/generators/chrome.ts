import fs from "node:fs";
import path from "node:path";

import { hexToRgb, isLightPalette, offsetRgb, type Rgb } from "../palettes/color";
import { variants } from "../palettes";
import type { ThemePalette, ThemeVariantSource } from "../palettes/types";

// Generate Chrome theme manifests from the shared palettes and hand-authored
// Graphite base. Chrome colors are [r, g, b] integer arrays. Per-channel offsets
// reproduce Graphite exactly; other variants inherit their background tint.
const chromeRoot = path.resolve(__dirname, "..", "..", "themes", "chrome");

type ChromeManifest = {
  manifest_version: number;
  name: string;
  short_name?: string;
  version: string;
  version_name?: string;
  description: string;
  minimum_chrome_version?: string;
  theme: { colors: Record<string, Rgb> };
};

// Graphite manifest colors keyed by "r,g,b": the palette role and per-channel offset.
// Light palettes use lightOffset: the toolbar matches the editor, darker than the
// frame, while the omnibox and text move toward dark.
type ChromeRole = { role: keyof ThemePalette; offset: number; lightOffset: number };

const roleByRgb: Record<string, ChromeRole> = Object.freeze({
  "18,18,18": { role: "chromeBg", offset: -10, lightOffset: -10 }, // ntp_background
  "32,32,32": { role: "overlayBg", offset: 0, lightOffset: 0 }, // frame, tabs, ntp_header, button_background
  "48,48,48": { role: "editorBg", offset: 8, lightOffset: 0 }, // toolbar (active tab)
  "64,64,64": { role: "editorBg", offset: 24, lightOffset: -12 }, // omnibox_background
  "200,200,200": { role: "editorBg", offset: 160, lightOffset: -160 }, // inactive tab text, toolbar icons
  "225,225,225": { role: "editorBg", offset: 185, lightOffset: -185 }, // background tab text
  "250,250,250": { role: "editorBg", offset: 210, lightOffset: -210 }, // primary text
  "240,168,74": { role: "accent", offset: 0, lightOffset: 0 }, // ntp_link
});

// Folder name + description tagline per variant; the name comes from the variant itself.
const taglineById: Record<string, string> = Object.freeze({
  graphite: "A muted graphite dark theme with neutral accents.",
  classic: "A muted dark theme with a warm-olive cast.",
  espresso: "A muted dark theme with a warm-brown cast.",
  clay: "A dark theme with near-black neutrals and clay-orange accents, inspired by Claude.",
  nautilus: "A muted dark theme with a cool blue-gray cast.",
  paper: "A muted light theme with a warm off-white cast.",
});

export function generateChromeThemes(): void {
  const baseManifestPath = path.resolve(__dirname, "..", "bases", "chrome.json");
  const baseManifest = JSON.parse(fs.readFileSync(baseManifestPath, "utf8")) as ChromeManifest;

  for (const variant of variants) {
    const manifest = buildManifest(baseManifest, variant);
    const outputDir = path.join(chromeRoot, `zenkai-${variant.id}`);
    const outputPath = path.join(outputDir, "manifest.json");

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, `${serialize(manifest)}\n`, "utf8");
    console.log(`Generated ${path.relative(chromeRoot, outputPath)}`);
  }
}

function buildManifest(baseManifest: ChromeManifest, variant: ThemeVariantSource): ChromeManifest {
  return {
    ...baseManifest,
    name: variant.name,
    description: `${variant.name} - ${taglineById[variant.id] ?? ""}`.trim(),
    theme: { colors: mapColors(baseManifest.theme.colors, variant.palette) },
  };
}

function mapColors(colors: Record<string, Rgb>, palette: ThemePalette): Record<string, Rgb> {
  const result: Record<string, Rgb> = {};
  const light = isLightPalette(palette);

  for (const [key, value] of Object.entries(colors)) {
    const entry = roleByRgb[value.join(",")];
    result[key] = entry
      ? offsetRgb(hexToRgb(palette[entry.role]), light ? entry.lightOffset : entry.offset)
      : value;
  }

  return result;
}

// Pretty-print with 2-space indent, but keep each [r, g, b] color array on one line
// to match the conventional Chrome manifest style.
function serialize(manifest: ChromeManifest): string {
  return JSON.stringify(manifest, null, 2).replace(
    /\[\s*\n\s*(\d+),\s*\n\s*(\d+),\s*\n\s*(\d+)\s*\n\s*\]/g,
    "[$1, $2, $3]",
  );
}
