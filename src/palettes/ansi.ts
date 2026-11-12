import type { ThemePalette } from "./types";

export const ANSI_NAMES = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"] as const;

export type AnsiName = (typeof ANSI_NAMES)[number];

export type TerminalColors = {
  normal: Record<AnsiName, string>;
  bright: Record<AnsiName, string>;
  background: string;
  foreground: string;
  cursor: string;
  selectionBackground: string;
  selectionForeground: string;
};

// Terminal colors for standalone terminal themes. They match the Zed terminal colors,
// including Monokai Pro's convention of orange (warning) for blue.
export function ansiColors(palette: ThemePalette): TerminalColors {
  const normal: Record<AnsiName, string> = {
    black: palette.surfaceBg,
    red: palette.error,
    green: palette.success,
    yellow: palette.accent,
    blue: palette.warning,
    magenta: palette.purple,
    cyan: palette.info,
    white: palette.fg,
  };

  return {
    normal,
    bright: { ...normal, black: palette.fgSubtle, white: palette.brightFg },
    background: palette.editorBg,
    foreground: palette.fg,
    cursor: palette.fg,
    selectionBackground: palette.interactionBg,
    selectionForeground: palette.fg,
  };
}
