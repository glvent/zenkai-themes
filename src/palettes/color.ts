import type { ThemePalette } from "./types";

// Color math and derived colors shared by the theme generators. Derived colors are
// palette roles shifted by fixed amounts, chosen so Graphite reproduces its
// hand-authored values exactly while the other variants inherit their tint.

export type Rgb = [number, number, number];

// Light palettes put dark text on a light editor; derived contrast offsets flip sign.
export function isLightPalette(palette: ThemePalette): boolean {
  return luminance(palette.editorBg) > luminance(palette.fg);
}

// Comment gray used for syntax comments in VS Code and Zed: fgSubtle nudged toward the editor.
export function commentGray(palette: ThemePalette): string {
  return offsetHex(palette.fgSubtle, isLightPalette(palette) ? 3 : -3);
}

// Shift every channel by a fixed amount, clamped to the byte range.
export function offsetHex(hex: string, delta: number): string {
  return rgbToHex(offsetRgb(hexToRgb(hex), delta));
}

export function offsetRgb(rgb: Rgb, delta: number): Rgb {
  return rgb.map((channel) => clampByte(channel + delta)) as Rgb;
}

// Scale every channel toward black, rounding per channel.
export function darkenHex(hex: string, factor: number): string {
  return rgbToHex(hexToRgb(hex).map((channel) => clampByte(Math.round(channel * factor))) as Rgb);
}

export function hexToRgb(hex: string): Rgb {
  const value = hex.slice(1);
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

// WCAG 2 contrast ratio between two opaque colors, from 1 (identical) to 21 (black on white).
export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rgbToHex(rgb: Rgb): string {
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, value));
}
