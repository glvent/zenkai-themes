import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { ANSI_NAMES, ansiColors } from "../../../src/palettes/ansi";
import { variants } from "../../../src/palettes";
import { generateTerminalThemes } from "../../../src/generators/terminals";

const packageRoot = path.resolve(__dirname, "../../../..");
const repoRoot = path.resolve(packageRoot, "../..");
const committedRoot = path.join(repoRoot, "themes", "terminal");
// The compiled generator writes next to its own build output, not into the repository.
const generatedRoot = path.resolve(__dirname, "../../../themes/terminal");

function listFiles(root: string): string[] {
  return fs
    .readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(root, path.join(entry.parentPath, entry.name)))
    .sort();
}

function generateQuietly(): void {
  const log = console.log;
  console.log = () => {};
  try {
    generateTerminalThemes();
  } finally {
    console.log = log;
  }
}

test("terminal themes are deterministic and match the committed outputs", () => {
  generateQuietly();
  const firstRun = new Map(listFiles(generatedRoot).map((file) => [file, fs.readFileSync(path.join(generatedRoot, file), "utf8")]));
  generateQuietly();

  const expectedFiles = [
    ...variants.map((variant) => path.join("ghostty", variant.name)),
    ...variants.map((variant) => path.join("iterm2", `${variant.name}.itermcolors`)),
    path.join("windows-terminal", "zenkai.json"),
  ].sort();

  assert.deepEqual(listFiles(generatedRoot), expectedFiles);
  assert.deepEqual(listFiles(committedRoot), expectedFiles);

  for (const file of expectedFiles) {
    const generated = fs.readFileSync(path.join(generatedRoot, file), "utf8");
    assert.equal(generated, firstRun.get(file), `${file} changed between runs`);
    assert.equal(fs.readFileSync(path.join(committedRoot, file), "utf8"), generated, `${file} is stale; run npm run generate`);
  }
});

test("terminal colors match the Zed terminal colors", () => {
  for (const variant of variants) {
    const zedTheme = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "themes", "zed", "themes", `zenkai-${variant.id}.json`), "utf8")
    ) as { themes: Array<{ style: Record<string, string> }> };
    const style = zedTheme.themes[0].style;
    const colors = ansiColors(variant.palette);

    assert.equal(colors.background, style["terminal.background"], `${variant.name} background diverged`);
    assert.equal(colors.foreground, style["terminal.foreground"], `${variant.name} foreground diverged`);
    for (const name of ANSI_NAMES) {
      assert.equal(colors.normal[name], style[`terminal.ansi.${name}`], `${variant.name} ${name} diverged`);
      assert.equal(colors.bright[name], style[`terminal.ansi.bright_${name}`], `${variant.name} bright ${name} diverged`);
    }
  }
});
