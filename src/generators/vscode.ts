import fs from "node:fs";
import path from "node:path";

import graphiteTheme from "../bases/vscode.json";
import { commentGray, isLightPalette } from "../palettes/color";
import { variants } from "../palettes";
import type { ThemePalette, ThemeVariantSource } from "../palettes/types";

const packageRoot = path.resolve(__dirname, "..", "..", "themes", "vscode");
const themeSchema = "vscode://schemas/color-theme";
type ThemeDocument = { colors: Record<string, string>; [key: string]: unknown };
type TokenColorRule = { settings?: Record<string, string> } & Record<string, unknown>;
// A semantic token style is a foreground hex or an object such as { foreground, fontStyle, strikethrough }.
type SemanticTokenStyle = string | Record<string, string | boolean>;

const baseTheme = graphiteTheme as ThemeDocument & {
  name?: string;
  semanticHighlighting?: boolean;
  semanticTokenColors?: Record<string, SemanticTokenStyle>;
  tokenColors?: TokenColorRule[];
  type?: string;
};

const graphiteRoleByHex: Record<string, keyof ThemePalette> = Object.freeze({
  "#1c1c1c": "chromeBg",
  "#202020": "overlayBg",
  "#232323": "commandCenterBg",
  "#242424": "sidebarBg",
  "#252525": "raisedBg",
  "#282828": "editorBg",
  "#2e2e2e": "activityBarBorder",
  "#323232": "border",
  "#383838": "indentGuideInactive",
  "#39383a": "surfaceBg",
  "#3a3a3a": "chromeBorder",
  "#434344": "panelBorder",
  "#555356": "interactionBg",
  "#5a5a5a": "indentGuideActive",
  "#5ad4e6": "info",
  "#6c6a6f": "fgSubtle",
  "#6e6c71": "fgStatus",
  "#7bd88f": "success",
  "#8b888f": "fgMuted",
  "#8e8b93": "fgSidebar",
  "#948ae3": "purple",
  "#bab6c0": "fgSecondary",
  "#f0a84a": "accent",
  "#f7f1ff": "fg",
  "#fc618d": "error",
  "#fd9353": "warning",
  "#ff0000": "pureRed",
  "#ffffff": "brightFg",
});

// Off-palette Graphite colors derived from a palette role.
const derivedByHex: Record<string, (palette: ThemePalette) => string> = Object.freeze({
  "#69676c": commentGray,
});

export function generateVscodeThemes(): void {
  fs.mkdirSync(path.join(packageRoot, "themes"), { recursive: true });
  for (const variant of variants) {
    const document = buildThemeDocument(variant);
    const outputPath = path.join(packageRoot, "themes", `zenkai-${variant.id}.json`);

    fs.writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
    console.log(`Generated ${path.relative(packageRoot, outputPath)}`);
  }
}

function buildThemeDocument(variant: ThemeVariantSource): ThemeDocument {
  return {
    $schema: themeSchema,
    type: isLightPalette(variant.palette) ? "light" : "dark",
    colors: buildWorkbenchColors(variant.palette),
    tokenColors: buildTokenColors(variant.palette),
    semanticTokenColors: buildSemanticTokenColors(variant.palette),
    name: variant.name,
    semanticHighlighting: baseTheme.semanticHighlighting ?? true,
  };
}

function buildWorkbenchColors(palette: ThemePalette): Record<string, string> {
  const nextColors: Record<string, string> = {};

  for (const [colorKey, colorValue] of Object.entries(baseTheme.colors)) {
    nextColors[colorKey] = mapColor(colorValue, palette);
  }

  return nextColors;
}

function buildTokenColors(palette: ThemePalette): TokenColorRule[] {
  return (baseTheme.tokenColors ?? []).map((rule) => {
    if (!rule.settings) {
      return rule;
    }

    const settings: Record<string, string> = {};
    for (const [key, value] of Object.entries(rule.settings)) {
      settings[key] = mapColor(value, palette);
    }
    return { ...rule, settings };
  });
}

function buildSemanticTokenColors(palette: ThemePalette): Record<string, SemanticTokenStyle> {
  const nextStyles: Record<string, SemanticTokenStyle> = {};

  for (const [selector, style] of Object.entries(baseTheme.semanticTokenColors ?? {})) {
    if (typeof style === "string") {
      nextStyles[selector] = mapColor(style, palette);
      continue;
    }

    const nextStyle: Record<string, string | boolean> = {};
    for (const [key, value] of Object.entries(style)) {
      nextStyle[key] = typeof value === "string" ? mapColor(value, palette) : value;
    }
    nextStyles[selector] = nextStyle;
  }

  return nextStyles;
}

function mapColor(colorValue: string, palette: ThemePalette): string {
  const normalized = colorValue.toLowerCase();

  if (!/^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(normalized)) {
    return colorValue;
  }

  const baseHex = normalized.slice(0, 7);
  const alphaSuffix = normalized.length === 9 ? normalized.slice(7) : "";
  const role = graphiteRoleByHex[baseHex];
  if (role) {
    return `${palette[role]}${alphaSuffix}`;
  }

  const derive = derivedByHex[baseHex];
  return derive ? `${derive(palette)}${alphaSuffix}` : colorValue;
}
