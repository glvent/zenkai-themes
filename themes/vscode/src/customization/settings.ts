import { BORDER_CONTRAST_DEFAULT, BORDER_CONTRAST_OPTIONS } from "./borders";
import { getSupportedThemeNames } from "./catalog";
import { normalizeHex, normalizeUnitInterval } from "./color";
import type { NormalizedSettings, RawSettings } from "./types";

/**
 * Coerce user configuration into a stable internal shape so the override builders
 * only deal with validated values.
 */
export function normalizeSettings(rawSettings: RawSettings = {}): NormalizedSettings {
  const accentPresets: NormalizedSettings["accentPresets"] = {};
  for (const themeName of getSupportedThemeNames()) {
    const preset = rawSettings.accentPresets?.[themeName];
    if (typeof preset === "string") {
      accentPresets[themeName] = preset;
    }
  }

  // Only plain #RRGGBB is accepted; anything else (including alpha forms) means "no custom color".
  const customColor = normalizeHex(rawSettings.accentCustomColor);

  return {
    accentCustomColor: customColor.length === 7 ? customColor : "",
    accentPresets,
    borderContrast:
      typeof rawSettings.borderContrast === "string" &&
      BORDER_CONTRAST_OPTIONS.includes(rawSettings.borderContrast)
        ? rawSettings.borderContrast
        : BORDER_CONTRAST_DEFAULT,
    popupTransparency: normalizeUnitInterval(rawSettings.popupTransparency),
    terminalMatchLocation: rawSettings.terminalMatchLocation === true,
  };
}
