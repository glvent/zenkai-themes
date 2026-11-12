import fs from "node:fs";
import path from "node:path";

import { ANSI_NAMES, ansiColors, type TerminalColors } from "../palettes/ansi";
import { hexToRgb } from "../palettes/color";
import { variants } from "../palettes";

// Generate Ghostty, iTerm2 and Windows Terminal themes from the shared palettes.
const terminalRoot = path.resolve(__dirname, "..", "..", "themes", "terminal");

export function generateTerminalThemes(): void {
  // Start clean so a renamed or removed variant leaves no stale theme behind.
  fs.rmSync(terminalRoot, { recursive: true, force: true });

  const windowsSchemes: Record<string, string>[] = [];

  for (const variant of variants) {
    const colors = ansiColors(variant.palette);
    writeOutput(path.join("ghostty", variant.name), ghosttyTheme(colors));
    writeOutput(path.join("iterm2", `${variant.name}.itermcolors`), itermTheme(colors));
    windowsSchemes.push(windowsTerminalScheme(variant.name, colors));
  }

  writeOutput(path.join("windows-terminal", "zenkai.json"), `${JSON.stringify(windowsSchemes, null, 2)}\n`);
}

function writeOutput(relativePath: string, contents: string): void {
  const outputPath = path.join(terminalRoot, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, contents, "utf8");
  console.log(`Generated ${path.relative(path.dirname(terminalRoot), outputPath)}`);
}

// ANSI colors in terminal index order: 0-7 normal, 8-15 bright.
function indexedColors(colors: TerminalColors): string[] {
  return [...ANSI_NAMES.map((name) => colors.normal[name]), ...ANSI_NAMES.map((name) => colors.bright[name])];
}

function ghosttyTheme(colors: TerminalColors): string {
  const lines = [
    ...indexedColors(colors).map((hex, index) => `palette = ${index}=${hex}`),
    `background = ${colors.background}`,
    `foreground = ${colors.foreground}`,
    `cursor-color = ${colors.cursor}`,
    `cursor-text = ${colors.background}`,
    `selection-background = ${colors.selectionBackground}`,
    `selection-foreground = ${colors.selectionForeground}`,
  ];
  return `${lines.join("\n")}\n`;
}

function itermTheme(colors: TerminalColors): string {
  const entries: Array<[string, string]> = [
    ...indexedColors(colors).map((hex, index): [string, string] => [`Ansi ${index} Color`, hex]),
    ["Background Color", colors.background],
    ["Foreground Color", colors.foreground],
    ["Bold Color", colors.foreground],
    ["Cursor Color", colors.cursor],
    ["Cursor Text Color", colors.background],
    ["Selection Color", colors.selectionBackground],
    ["Selected Text Color", colors.selectionForeground],
  ];

  const body = entries.map(([key, hex]) => `\t<key>${key}</key>\n${itermColor(hex)}`).join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    "<dict>",
    body,
    "</dict>",
    "</plist>",
    "",
  ].join("\n");
}

function itermColor(hex: string): string {
  const [red, green, blue] = hexToRgb(hex).map((channel) => Number((channel / 255).toFixed(6)));
  return [
    "\t<dict>",
    "\t\t<key>Alpha Component</key>",
    "\t\t<real>1</real>",
    "\t\t<key>Blue Component</key>",
    `\t\t<real>${blue}</real>`,
    "\t\t<key>Color Space</key>",
    "\t\t<string>sRGB</string>",
    "\t\t<key>Green Component</key>",
    `\t\t<real>${green}</real>`,
    "\t\t<key>Red Component</key>",
    `\t\t<real>${red}</real>`,
    "\t</dict>",
  ].join("\n");
}

function windowsTerminalScheme(name: string, colors: TerminalColors): Record<string, string> {
  const scheme: Record<string, string> = {
    name,
    background: colors.background,
    foreground: colors.foreground,
    cursorColor: colors.cursor,
    selectionBackground: colors.selectionBackground,
  };

  for (const ansiName of ANSI_NAMES) {
    // Windows Terminal calls ANSI magenta "purple".
    const windowsName = ansiName === "magenta" ? "purple" : ansiName;
    scheme[windowsName] = colors.normal[ansiName];
    scheme[`bright${windowsName[0].toUpperCase()}${windowsName.slice(1)}`] = colors.bright[ansiName];
  }

  return scheme;
}
