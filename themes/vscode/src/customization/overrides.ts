import { resolvePreset } from "./accents";
import { BORDER_CONTRAST_LEVELS } from "./borders";
import {
  ACCENT_ALPHA_KEYS,
  ACCENT_COLOR_KEYS,
  BORDER_CONTRAST_KEYS,
  DEFAULT_COLOR_VALUE,
  POPUP_BACKGROUND_KEYS,
  TERMINAL_MATCH_KEYS,
} from "./keys";
import { SUPPORTED_THEMES } from "./catalog";
import { getAlphaChannel, withAlpha, alphaFromTransparency, mixHex } from "./color";
import { normalizeSettings } from "./settings";
import type { RawSettings, ThemeCustomizationBlock, ThemeName } from "./types";

/**
 * Build the managed color overrides for one bundled theme from normalized user preferences.
 * Each section applies one customization dimension: accent, borders, terminal and popups.
 */
export function buildThemeOverrides(
  themeName: ThemeName,
  rawSettings: RawSettings
): ThemeCustomizationBlock {
  const theme = SUPPORTED_THEMES[themeName];

  if (!theme) {
    return {};
  }

  const settings = normalizeSettings(rawSettings);
  const colors = theme.colors;
  const overrides: ThemeCustomizationBlock = {};

  // A custom color wins over the per-theme preset; Default/invalid values leave the bundled accent.
  const accentColor =
    settings.accentCustomColor || resolvePreset(themeName, settings.accentPresets[themeName]);

  if (accentColor) {
    for (const colorKey of ACCENT_COLOR_KEYS) {
      if (colors[colorKey]) {
        overrides[colorKey] = accentColor;
      }
    }

    // Keep each key's bundled alpha so tints stay translucent.
    for (const colorKey of ACCENT_ALPHA_KEYS) {
      const alpha = colors[colorKey] ? getAlphaChannel(colors[colorKey]) : null;
      if (alpha) {
        overrides[colorKey] = withAlpha(accentColor, alpha);
      }
    }
  }

  // normalizeSettings limits borderContrast to known options; Default has no level entry.
  const borderLevel = BORDER_CONTRAST_LEVELS[settings.borderContrast];
  const borderTarget =
    borderLevel && colors[borderLevel.target === "background" ? "editor.background" : "foreground"];

  if (borderLevel && borderTarget) {
    for (const colorKey of BORDER_CONTRAST_KEYS) {
      if (colors[colorKey]) {
        overrides[colorKey] = mixHex(colors[colorKey], borderTarget, borderLevel.amount);
      }
    }
  }

  // With no terminal color, VS Code paints the terminal with the panel, sidebar, or editor
  // background depending on where the terminal view lives.
  if (settings.terminalMatchLocation) {
    for (const colorKey of TERMINAL_MATCH_KEYS) {
      overrides[colorKey] = DEFAULT_COLOR_VALUE;
    }
  }

  if (settings.popupTransparency > 0) {
    const alpha = alphaFromTransparency(settings.popupTransparency);

    for (const colorKey of POPUP_BACKGROUND_KEYS) {
      const baseColor = overrides[colorKey] ?? colors[colorKey];

      if (!baseColor) {
        continue;
      }

      overrides[colorKey] = withAlpha(baseColor, alpha);
    }
  }

  const hoverBackground = overrides["editorHoverWidget.background"] ?? colors["editorHoverWidget.background"];
  if (hoverBackground) {
    overrides["editorHoverWidget.statusBarBackground"] = hoverBackground;
  }

  return overrides;
}
