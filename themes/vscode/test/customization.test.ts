import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ACCENT_DEFAULT,
  ACCENT_PRESETS,
  BORDER_CONTRAST_DEFAULT,
  BORDER_CONTRAST_OPTIONS,
  MANAGED_COLOR_KEYS,
  getSupportedThemeNames,
  alphaFromTransparency,
  buildColorCustomizations,
  buildThemeOverrides,
  mixHex,
  normalizeSettings,
  withAlpha,
} from "../src/customization";
import {
  ACCENT_ALPHA_KEYS,
  ACCENT_COLOR_KEYS,
  BORDER_CONTRAST_KEYS,
} from "../src/customization/keys";
import clayTheme from "../themes/zenkai-clay.json";
import graphiteTheme from "../themes/zenkai-graphite.json";

test("popup transparency applies alpha to popup menu backgrounds", () => {
  const overrides = buildThemeOverrides("Zenkai Graphite", {
    popupTransparency: 0.4,
  });

  assert.equal(overrides["menu.background"], "#20202066");
  assert.equal(overrides["dropdown.background"], "#20202066");
  assert.equal(overrides["dropdown.listBackground"], "#20202066");
  assert.equal(overrides["editorSuggestWidget.background"], "#20202066");
  assert.equal(overrides["editorHoverWidget.background"], "#20202066");
  assert.equal(overrides["editorHoverWidget.statusBarBackground"], "#20202066");
  assert.equal(overrides["quickInput.background"], "#20202066");
});

test("hover status bar mirrors the hover background even without popup transparency", () => {
  const overrides = buildThemeOverrides("Zenkai Graphite", {});

  assert.equal(overrides["editorHoverWidget.background"], undefined);
  assert.equal(
    overrides["editorHoverWidget.statusBarBackground"],
    graphiteTheme.colors["editorHoverWidget.background"]
  );
});

test("terminal location match resets the terminal color to the VS Code default and clears when disabled", () => {
  const enabled = buildThemeOverrides("Zenkai Graphite", {
    terminalMatchLocation: true,
  });
  assert.equal(enabled["terminal.background"], "default");
  assert.equal(enabled["outputView.background"], undefined);
  assert.equal(enabled["outputViewStickyScroll.background"], undefined);

  const disabled = buildThemeOverrides("Zenkai Graphite", {
    terminalMatchLocation: false,
  });
  assert.equal(disabled["terminal.background"], undefined);
});

test("buildColorCustomizations preserves unrelated keys and prunes legacy accent overrides", () => {
  const existing = {
    "editorCursor.foreground": "#ffffff",
    "[Zenkai Classic]": {
      "sideBar.foreground": "#abcdef",
      "activityBar.activeFocusBorder": "#654321",
      "panelTitle.activeBorder": "#654321",
      "tab.activeForeground": "#ff6188",
      "editor.findMatchBackground": "#ff618826",
    },
  };

  const applied = buildColorCustomizations(existing, "Zenkai Classic", {
    terminalMatchLocation: true,
  });
  const classicBlock = applied["[Zenkai Classic]"] as Record<string, string>;

  assert.equal(applied["editorCursor.foreground"], "#ffffff");
  assert.equal(classicBlock["sideBar.foreground"], "#abcdef");
  assert.equal(classicBlock["terminal.background"], "default");
  assert.equal(classicBlock["activityBar.activeFocusBorder"], undefined);
  assert.equal(classicBlock["panelTitle.activeBorder"], undefined);
  assert.equal(classicBlock["tab.activeForeground"], undefined);
  assert.equal(classicBlock["editor.findMatchBackground"], undefined);
  assert.equal(
    (applied["[Zenkai Graphite]"] as Record<string, string>)["terminal.background"],
    "default"
  );

  const reset = buildColorCustomizations(applied, "Zenkai Classic", {});
  assert.equal(reset["editorCursor.foreground"], "#ffffff");
  assert.equal(
    (reset["[Zenkai Classic]"] as Record<string, string>)["sideBar.foreground"],
    "#abcdef"
  );
  assert.equal(
    (reset["[Zenkai Classic]"] as Record<string, string>)["terminal.background"],
    undefined
  );
});

test("unsupported active themes are left untouched", () => {
  const existing = {
    "[Zenkai Graphite]": {
      "tab.activeForeground": "#f0a84a",
    },
  };

  assert.equal(
    buildColorCustomizations(existing, "One Dark Pro", {
      terminalMatchLocation: true,
    }),
    existing
  );
});

test("utility helpers preserve alpha channels", () => {
  assert.equal(alphaFromTransparency(0), "00");
  assert.equal(alphaFromTransparency(0.4), "66");
  assert.equal(alphaFromTransparency(1), "ff");
  assert.equal(withAlpha("#78dce8", "26"), "#78dce826");
});

test("popup transparency normalization preserves decimals and clamps to the supported range", () => {
  assert.equal(normalizeSettings({ popupTransparency: 0.35 }).popupTransparency, 0.35);
  assert.equal(normalizeSettings({ popupTransparency: -1 }).popupTransparency, 0);
  assert.equal(normalizeSettings({ popupTransparency: 2 }).popupTransparency, 1);
});

const CLAY_ACCENT = "#6a9bcc";
const clayColors = clayTheme.colors as Record<string, string>;

test("accent preset recolors accent keys on the matching theme only", () => {
  const settings = { accentPresets: { "Zenkai Clay": "Crail" } };
  const clay = buildThemeOverrides("Zenkai Clay", settings);

  assert.equal(clay["tab.activeForeground"], "#c15f3c");
  assert.equal(clay["terminal.tab.activeBorder"], "#c15f3c");
  for (const key of ACCENT_COLOR_KEYS) {
    assert.equal(clay[key], "#c15f3c", key);
  }
  assert.equal(buildThemeOverrides("Zenkai Graphite", settings)["tab.activeForeground"], undefined);
});

test("accent keys cover every bundled accent value in every theme", () => {
  // These keys share the accent value but mean "yellow" or "string", so a preset leaves them alone.
  const semantic = [
    "charts.yellow",
    "debugTokenExpression.string",
    "editorBracketHighlight.foreground3",
    "editorBracketPairGuide.activeBackground3",
    "editorBracketPairGuide.background3",
    "scmGraph.foreground3",
    "symbolIcon.stringForeground",
    "symbolIcon.textForeground",
    "terminal.ansiBrightYellow",
    "terminal.ansiYellow",
  ];
  const known = new Set([...ACCENT_COLOR_KEYS, ...ACCENT_ALPHA_KEYS, ...semantic]);
  const accents: Record<string, string> = {
    "Zenkai Graphite": "#f0a84a",
    "Zenkai Classic": "#ddb860",
    "Zenkai Espresso": "#c89878",
    "Zenkai Nautilus": "#5278a0",
    "Zenkai Clay": CLAY_ACCENT,
    "Zenkai Paper": "#8a5e10",
  };
  const files = {
    "Zenkai Graphite": "graphite",
    "Zenkai Classic": "classic",
    "Zenkai Espresso": "espresso",
    "Zenkai Nautilus": "nautilus",
    "Zenkai Clay": "clay",
    "Zenkai Paper": "paper",
  } as const;

  for (const [name, file] of Object.entries(files)) {
    const colors = JSON.parse(readFileSync(`themes/zenkai-${file}.json`, "utf8")).colors as Record<
      string,
      string
    >;
    const found = Object.keys(colors).filter((k) =>
      colors[k].toLowerCase().startsWith(accents[name])
    );
    assert.deepEqual(
      found.filter((k) => !known.has(k)),
      [],
      name
    );
    for (const key of ACCENT_COLOR_KEYS) assert.equal(colors[key], accents[name], `${name} ${key}`);
    for (const key of ACCENT_ALPHA_KEYS)
      assert.ok(colors[key].startsWith(accents[name]), `${name} ${key}`);
  }
});

test("accent alpha keys keep their bundled alpha suffix", () => {
  const overrides = buildThemeOverrides("Zenkai Clay", {
    accentPresets: { "Zenkai Clay": "Kraft" },
  });

  for (const key of ACCENT_ALPHA_KEYS) {
    assert.equal(overrides[key], `#d4a27f${clayColors[key].slice(7)}`, key);
  }
  assert.equal(overrides["chat.slashCommandBackground"], "#d4a27f26");
  assert.equal(overrides["minimap.chatEditHighlight"], "#d4a27fa5");
});

test("custom accent color wins over the preset", () => {
  const overrides = buildThemeOverrides("Zenkai Clay", {
    accentCustomColor: "#AABBCC",
    accentPresets: { "Zenkai Clay": "Crail" },
  });

  assert.equal(overrides["tab.activeForeground"], "#aabbcc");
  assert.equal(overrides["chat.slashCommandBackground"], "#aabbcc26");
  // Custom color applies to every theme.
  assert.equal(
    buildThemeOverrides("Zenkai Paper", { accentCustomColor: "#aabbcc" })["tab.activeForeground"],
    "#aabbcc"
  );
});

test("Default, unknown, and malformed accent values produce no accent overrides", () => {
  const cases = [
    { accentPresets: { "Zenkai Clay": ACCENT_DEFAULT } },
    { accentPresets: { "Zenkai Clay": "Nope" } },
    { accentPresets: { "Zenkai Clay": "toString" } },
    { accentPresets: { "Zenkai Clay": 5 } },
    { accentCustomColor: "red" },
    { accentCustomColor: "#12345" },
    { accentCustomColor: "#12345678" },
    { accentCustomColor: 42 },
    { accentCustomColor: "" },
  ];

  for (const settings of cases) {
    const overrides = buildThemeOverrides("Zenkai Clay", settings);
    for (const key of [...ACCENT_COLOR_KEYS, ...ACCENT_ALPHA_KEYS]) {
      assert.equal(overrides[key], undefined, `${JSON.stringify(settings)} ${key}`);
    }
  }
});

test("switching accent back to Default removes managed accent keys and keeps user keys", () => {
  const applied = buildColorCustomizations(
    { "[Zenkai Clay]": { "sideBar.foreground": "#abcdef" } },
    "Zenkai Clay",
    { accentPresets: { "Zenkai Clay": "Crail" } }
  );
  const block = applied["[Zenkai Clay]"] as Record<string, string>;
  assert.equal(block["tab.activeForeground"], "#c15f3c");

  const reset = buildColorCustomizations(applied, "Zenkai Clay", {
    accentPresets: { "Zenkai Clay": ACCENT_DEFAULT },
  });
  assert.deepEqual(reset["[Zenkai Clay]"], {
    "editorHoverWidget.statusBarBackground": clayColors["editorHoverWidget.background"],
    "sideBar.foreground": "#abcdef",
  });
  for (const key of [...ACCENT_COLOR_KEYS, ...ACCENT_ALPHA_KEYS]) {
    assert.ok(MANAGED_COLOR_KEYS.includes(key), key);
  }
});

test("package.json accent settings match the ACCENT_PRESETS module", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const props = pkg.contributes.configuration.properties;
  const defaults: Record<string, string> = {
    "Zenkai Graphite": "#f0a84a",
    "Zenkai Classic": "#ddb860",
    "Zenkai Espresso": "#c89878",
    "Zenkai Nautilus": "#5278a0",
    "Zenkai Clay": CLAY_ACCENT,
    "Zenkai Paper": "#8a5e10",
  };

  for (const themeName of getSupportedThemeNames()) {
    const prop = props[`zenkai.accent.${themeName.replace("Zenkai ", "").toLowerCase()}`];
    const presets = ACCENT_PRESETS[themeName];

    assert.equal(prop.type, "string");
    assert.equal(prop.default, ACCENT_DEFAULT);
    assert.deepEqual(prop.enum, [ACCENT_DEFAULT, ...Object.keys(presets)]);
    assert.deepEqual(prop.enumDescriptions, [defaults[themeName], ...Object.values(presets)]);
    assert.ok(prop.markdownDescription.startsWith(`Accent color for ${themeName}.`));
  }

  const custom = props["zenkai.accentCustomColor"];
  assert.equal(custom.default, "");
  assert.equal(custom.pattern, "^$|^#[0-9a-fA-F]{6}$");
});

test("mixHex blends RGB channels and keeps the source alpha", () => {
  assert.equal(mixHex("#000000", "#ffffff", 0.5), "#808080");
  assert.equal(mixHex("#20202066", "#ffffff", 0), "#20202066");
  assert.equal(mixHex("#123456", "#abcdef", 1), "#abcdef");
  assert.equal(mixHex("#123456", "nope", 0.5), "#123456");
});

test("border contrast keys are opaque neutral borders in every theme", () => {
  for (const themeName of getSupportedThemeNames()) {
    const colors = JSON.parse(
      readFileSync(`themes/${themeName.toLowerCase().replace(" ", "-")}.json`, "utf8")
    ).colors as Record<string, string>;

    for (const key of BORDER_CONTRAST_KEYS) {
      assert.match(colors[key] ?? "", /^#[0-9a-f]{6}$/, `${themeName} ${key}`);
      assert.notEqual(colors[key], colors["editor.background"], `${themeName} ${key}`);
      assert.ok(!ACCENT_COLOR_KEYS.includes(key), key);
      assert.ok(MANAGED_COLOR_KEYS.includes(key), key);
    }
  }
});

test("border contrast Low softens and High strengthens borders against the background", () => {
  const colors = graphiteTheme.colors as Record<string, string>;
  const low = buildThemeOverrides("Zenkai Graphite", { borderContrast: "Low" });
  const high = buildThemeOverrides("Zenkai Graphite", { borderContrast: "High" });

  assert.equal(
    low["editorGroup.border"],
    mixHex(colors["editorGroup.border"], colors["editor.background"], 0.5)
  );
  assert.equal(
    high["editorGroup.border"],
    mixHex(colors["editorGroup.border"], colors["foreground"], 0.15)
  );
  for (const key of BORDER_CONTRAST_KEYS) {
    assert.ok(low[key], key);
    assert.ok(high[key], key);
  }
  assert.equal(high["editor.findMatchBorder"], undefined);
  assert.equal(high["tab.border"], undefined);
});

test("Default and unknown border contrast values produce no border overrides", () => {
  for (const borderContrast of [undefined, "Default", "Extreme", 3]) {
    const overrides = buildThemeOverrides("Zenkai Paper", { borderContrast });
    for (const key of BORDER_CONTRAST_KEYS) {
      assert.equal(overrides[key], undefined, `${String(borderContrast)} ${key}`);
    }
  }
  assert.equal(
    normalizeSettings({ borderContrast: "Extreme" }).borderContrast,
    BORDER_CONTRAST_DEFAULT
  );
});

test("switching border contrast back to Default clears managed border keys", () => {
  const high = buildColorCustomizations({}, "Zenkai Clay", { borderContrast: "High" });
  assert.ok((high["[Zenkai Clay]"] as Record<string, string>)["sideBar.border"]);

  const reset = buildColorCustomizations(high, "Zenkai Clay", { borderContrast: "Default" });
  assert.equal((reset["[Zenkai Clay]"] as Record<string, string>)["sideBar.border"], undefined);
});

test("package.json border contrast setting matches the borders module", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const prop = pkg.contributes.configuration.properties["zenkai.borderContrast"];

  assert.equal(prop.type, "string");
  assert.equal(prop.default, BORDER_CONTRAST_DEFAULT);
  assert.deepEqual(prop.enum, [...BORDER_CONTRAST_OPTIONS]);
  assert.equal(prop.enumDescriptions.length, prop.enum.length);
});
