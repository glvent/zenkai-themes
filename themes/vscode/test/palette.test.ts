import assert from "node:assert/strict";
import test from "node:test";

import { commentGray, contrastRatio } from "../../../src/palettes/color";
import { variants } from "../../../src/palettes";
import type { ThemePalette } from "../../../src/palettes/types";

// Minimum WCAG contrast against the editor background. Floors sit just under today's values,
// so a palette edit that makes text harder to read fails here.
const FLOORS: readonly [string, number, (palette: ThemePalette) => string][] = [
  ["fg", 7, (p) => p.fg],
  ["accent", 4.5, (p) => p.accent],
  ["error", 4.5, (p) => p.error],
  ["warning", 4.5, (p) => p.warning],
  ["success", 4.5, (p) => p.success],
  ["info", 4.5, (p) => p.info],
  ["purple", 4.5, (p) => p.purple],
  ["fgMuted", 4, (p) => p.fgMuted],
  ["fgSidebar", 4, (p) => p.fgSidebar],
  // Muted on purpose; the floor only guards against them getting darker.
  ["commentGray", 2.5, commentGray],
  ["fgSubtle", 2.5, (p) => p.fgSubtle],
];

test("contrastRatio matches WCAG reference values", () => {
  assert.equal(contrastRatio("#000000", "#ffffff"), 21);
  assert.equal(contrastRatio("#777777", "#777777"), 1);
  assert.equal(contrastRatio("#ffffff", "#777777").toFixed(2), "4.48");
});

for (const variant of variants) {
  test(`${variant.name} text roles meet contrast floors against the editor`, () => {
    for (const [role, floor, pick] of FLOORS) {
      const ratio = contrastRatio(pick(variant.palette), variant.palette.editorBg);
      assert.ok(ratio >= floor, `${role} ${pick(variant.palette)} is ${ratio.toFixed(2)}:1, below ${floor}:1`);
    }
  });
}
