import assert from "node:assert/strict";
import test from "node:test";

import { getSupportedThemeNames } from "../src/customization";
import { MANAGED_COLOR_KEYS } from "../src/customization/keys";
import classicTheme from "../themes/zenkai-classic.json";
import espressoTheme from "../themes/zenkai-espresso.json";
import clayTheme from "../themes/zenkai-clay.json";
import graphiteTheme from "../themes/zenkai-graphite.json";
import nautilusTheme from "../themes/zenkai-nautilus.json";
import paperTheme from "../themes/zenkai-paper.json";
import { commentGray } from "../../../src/palettes/color";
import classicVariant from "../../../src/palettes/variants/classic";
import espressoVariant from "../../../src/palettes/variants/espresso";
import clayVariant from "../../../src/palettes/variants/clay";
import graphiteVariant from "../../../src/palettes/variants/graphite";
import nautilusVariant from "../../../src/palettes/variants/nautilus";
import paperVariant from "../../../src/palettes/variants/paper";

const bundledThemes = [
  ["Zenkai Classic", classicTheme, classicVariant],
  ["Zenkai Espresso", espressoTheme, espressoVariant],
  ["Zenkai Nautilus", nautilusTheme, nautilusVariant],
  ["Zenkai Graphite", graphiteTheme, graphiteVariant],
  ["Zenkai Clay", clayTheme, clayVariant],
  ["Zenkai Paper", paperTheme, paperVariant],
] as const;

test("supported theme names stay aligned with the packaged variants", () => {
  assert.deepEqual(
    getSupportedThemeNames(),
    bundledThemes.map(([themeName]) => themeName)
  );
});

test("bundled theme metadata names match the packaged variants", () => {
  for (const [themeName, theme] of bundledThemes) {
    assert.equal(theme.name, themeName);
  }
});

test("tokenColors share scopes and remap colors through each variant palette", () => {
  const graphiteRules = graphiteTheme.tokenColors;

  for (const [themeName, theme, variant] of bundledThemes) {
    const { palette } = variant;
    const scopes = theme.tokenColors.map((rule) => rule.scope);
    const foregroundOf = (scope: string) =>
      theme.tokenColors.find((rule) => rule.scope === scope)?.settings.foreground;

    assert.deepEqual(scopes, graphiteRules.map((rule) => rule.scope), `${themeName} token scopes diverged`);
    assert.equal(foregroundOf("string"), palette.accent, `${themeName} string color mismatch`);
    assert.equal(foregroundOf("keyword"), palette.error, `${themeName} keyword color mismatch`);
    assert.equal(foregroundOf("constant.numeric"), palette.purple, `${themeName} number color mismatch`);
    assert.equal(
      theme.tokenColors[0]?.settings.foreground,
      commentGray(palette),
      `${themeName} comment color mismatch`
    );
  }
});

test("semanticTokenColors share selectors and remap colors through each variant palette", () => {
  type SemanticStyle = string | { foreground?: string; fontStyle?: string; strikethrough?: boolean };
  const semanticOf = (theme: { semanticTokenColors: object }) =>
    theme.semanticTokenColors as Record<string, SemanticStyle>;
  const graphiteSelectors = Object.keys(semanticOf(graphiteTheme));
  const foregroundRoles = {
    "class.defaultLibrary": "info",
    "type.defaultLibrary": "info",
    "function.defaultLibrary": "success",
    "variable.defaultLibrary": "info",
    selfParameter: "fgSecondary",
    clsParameter: "fgSecondary",
    selfKeyword: "fgSecondary",
  } as const;

  assert.deepEqual([...graphiteSelectors].sort(), ["*.deprecated", ...Object.keys(foregroundRoles)].sort());

  for (const [themeName, theme, variant] of bundledThemes) {
    const styles = semanticOf(theme);

    assert.deepEqual(Object.keys(styles), graphiteSelectors, `${themeName} selectors diverged`);
    assert.deepEqual(styles["*.deprecated"], { strikethrough: true }, `${themeName} deprecated style mismatch`);

    for (const [selector, role] of Object.entries(foregroundRoles)) {
      const style = styles[selector];
      const foreground = typeof style === "string" ? style : style?.foreground;
      assert.equal(foreground, variant.palette[role], `${themeName} ${selector} should use ${role}`);
    }
  }
});

test("bundled themes keep the managed keys required by customization", () => {
  const requiredKeys = new Set<string>([...MANAGED_COLOR_KEYS, "foreground"]);

  for (const [themeName, theme] of bundledThemes) {
    const colors = theme.colors as Record<string, string>;

    for (const key of requiredKeys) {
      assert.notEqual(colors[key], undefined, `${themeName} is missing ${key}`);
    }
  }
});

test("UI accents spread across palette roles by group", () => {
  const keysByRole = {
    accent: [
      "tab.activeForeground",
      "panelTitle.activeForeground",
      "list.activeSelectionForeground",
      "editor.findMatchBorder",
      "editorLightBulb.foreground",
    ],
    error: ["activityBarBadge.background", "panelTitleBadge.background"],
    info: ["textLink.foreground", "notificationLink.foreground"],
    success: ["checkbox.foreground", "radio.activeForeground", "settings.checkboxForeground", "testing.runAction"],
    purple: ["settings.headerForeground", "settings.modifiedItemIndicator"],
    warning: ["gitDecoration.modifiedResourceForeground", "gitDecoration.stageModifiedResourceForeground"],
  } as const;

  for (const [themeName, theme, variant] of bundledThemes) {
    const colors = theme.colors as Record<string, string>;

    for (const [role, keys] of Object.entries(keysByRole)) {
      for (const key of keys) {
        assert.equal(colors[key], variant.palette[role as keyof typeof keysByRole], `${themeName} ${key} should use ${role}`);
      }
    }
  }
});

test("bundled themes hide active activity and panel title underlines", () => {
  for (const [themeName, theme] of bundledThemes) {
    assert.equal(theme.colors["activityBar.activeBorder"], "#00000000", `${themeName} activity underline is visible`);
    assert.equal(
      theme.colors["activityBar.activeFocusBorder"],
      "#00000000",
      `${themeName} focused activity underline is visible`
    );
    assert.equal(theme.colors["panelTitle.activeBorder"], "#00000000", `${themeName} panel title underline is visible`);
    assert.equal(theme.colors["tab.activeBorder"], "#00000000", `${themeName} tab underline is visible`);
    assert.equal(theme.colors["sideBarTitle.border"], "#00000000", `${themeName} sidebar title separator is visible`);
    assert.equal(
      theme.colors["sideBarActivityBarTop.border"],
      "#00000000",
      `${themeName} sidebar top activity separator is visible`
    );
  }
});

test("output view always uses the panel surface background", () => {
  for (const [themeName, theme] of bundledThemes) {
    const panelBackground = theme.colors["panel.background"];

    assert.equal(theme.colors["outputView.background"], panelBackground, `${themeName} output background mismatch`);
    assert.equal(
      theme.colors["outputViewStickyScroll.background"],
      panelBackground,
      `${themeName} output sticky scroll background mismatch`
    );
  }
});

test("theme type follows each variant's appearance", () => {
  const expected: Record<string, string> = {
    "Zenkai Classic": "dark",
    "Zenkai Espresso": "dark",
    "Zenkai Nautilus": "dark",
    "Zenkai Graphite": "dark",
    "Zenkai Clay": "dark",
    "Zenkai Paper": "light",
  };

  for (const [themeName, theme] of bundledThemes) {
    assert.equal(theme.type, expected[themeName], `${themeName} type mismatch`);
  }
});
