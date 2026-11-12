# Zenkai Color System

This document defines how Zenkai colors relate across theme targets (VS Code, Zed, Chrome). Use it to port Zenkai to a new target so every variant stays consistent.

## Source of truth

- Role names: `src/palettes/types.ts` (`ThemePalette`).
- Role values per variant: `src/palettes/variants/{graphite,classic,espresso,nautilus,clay,paper}.ts`.
- Variant registry: `src/palettes/index.ts`, shared by all target generators.
- Hand-authored Graphite inputs: `src/bases/{vscode,zed,chrome}.json`.
- Generators: `src/generators/{vscode,zed,chrome}.ts`, run together by `src/generators/index.ts` through `npm run generate` in `themes/vscode`.

Color swatches in `README.md` are SVGs in `assets/swatches/`, written by `src/generators/swatches.ts` during repository-wide generation. To add one, write `![](assets/swatches/<hex>.svg)` next to the color and regenerate; unused swatches are removed.

Never hand-edit target theme outputs, including Graphite. Edit a palette or the corresponding Graphite base input, then regenerate. Ordinary VS Code builds regenerate only VS Code themes; `npm run generate` updates every target and the swatches.

## How generation works

Every target follows the same pattern:

1. **Graphite is the base.** Each target reads a hand-authored input from `src/bases/`: `vscode.json`, `zed.json`, or `chrome.json`. These inputs are separate from the generated target files and are never overwritten by generation.
2. **Reverse-map.** The generator matches each Graphite color value to a palette role (for example `#282828` is `editorBg`).
3. **Substitute.** The generator replaces the value with the same role from the target variant's palette, keeping any alpha suffix (`#f7f1ff26` becomes `<fg>26`).
4. **Pass through.** Values that match no role stay unchanged and are shared by all variants.

Because of step 2, every Graphite palette value must stay unique. Do not reuse a Graphite hex for an unrelated off-palette color, or it will be remapped.

## Palette roles

Roles are listed from darkest to lightest within each group for dark variants. Backgrounds form a strict brightness ladder; keep that order in new variants.

### Light variants

Paper is the light variant. Roles keep their meaning; only the direction of contrast flips:

- The background ladder flips: `editorBg` is the darkest background and `chromeBg` the lightest, so title bar, status bar, side bar, and menus are lighter than the editor.
- `surfaceBg`, `interactionBg`, borders, and guides sit darker than the editor.
- Foregrounds run from `fgSubtle` (lightest) to `brightFg` (darkest). `brightFg` replaces dark variants' pure white.
- Accents are deepened to keep roughly 4.5:1 contrast against `editorBg`.

Generators detect light palettes with `isLightPalette` in `src/palettes/color.ts` (editor brighter than `fg`) and set VS Code `type: "light"`, Zed `appearance: "light"`, and flip contrast offsets as noted in the derived grays table.

### Backgrounds and surfaces

| Role | Meaning | Graphite | Classic | Espresso | Nautilus | Clay | Paper |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `chromeBg` | Outermost window chrome: title bar, status bar, app background | `#1c1c1c` | `#1c1c1a` | `#1c1b1a` | `#1c1c1f` | `#161616` | `#f1efea` |
| `overlayBg` | Floating UI: menus, dropdowns, hovers, quick input, notifications, activity bar; browser frame and tabs | `#202020` | `#201f1e` | `#201f1e` | `#202023` | `#181818` | `#efede8` |
| `commandCenterBg` | Command center, status bar item hover | `#232323` | `#232220` | `#232120` | `#232427` | `#191919` | `#eeece7` |
| `sidebarBg` | Side bar, tab bar strip, inactive tabs | `#242424` | `#242422` | `#242220` | `#242427` | `#1a1a1a` | `#edebe6` |
| `raisedBg` | Sticky scroll, peek titles, drop targets, unchanged diff regions | `#252525` | `#252523` | `#252320` | `#262629` | `#1c1c1c` | `#ebe9e3` |
| `editorBg` | Main editing surface, active tab, inputs, terminal (Zed), text on colored badges | `#282828` | `#282826` | `#282724` | `#292a2d` | `#1d1d1d` | `#e9e7e1` |
| `surfaceBg` | Secondary surfaces: panel, buttons, badges, code blocks, peek editor, highlighted line, terminal (VS Code) | `#39383a` | `#393834` | `#393634` | `#393b3e` | `#292929` | `#dbd9d2` |
| `interactionBg` | Hover/active fills, input borders, line numbers, rulers, whitespace, disabled text | `#555356` | `#555452` | `#555250` | `#55565a` | `#424242` | `#b1aea6` |

### Borders and guides

| Role | Meaning | Graphite | Classic | Espresso | Nautilus | Clay | Paper |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `activityBarBorder` | Activity bar edge only | `#2e2e2e` | `#2e2e2c` | `#2e2c2a` | `#2e2f32` | `#242424` | `#d4d2cc` |
| `border` | Default border for widgets, groups, popups | `#323232` | `#323230` | `#32302e` | `#323336` | `#2b2b2b` | `#d0cec7` |
| `indentGuideInactive` | Inactive indent guides | `#383838` | `#383836` | `#383634` | `#38393c` | `#2f2f2f` | `#d6d4ce` |
| `chromeBorder` | Borders on chrome: side bar, status bar, title bar; Zed active/selected elements | `#3a3a3a` | `#3a3a38` | `#3a3836` | `#3a3b3e` | `#313131` | `#cbc9c2` |
| `panelBorder` | Panel and terminal borders | `#434344` | `#434341` | `#43403e` | `#434447` | `#353535` | `#c5c3bb` |
| `indentGuideActive` | Active indent guide, tree guides | `#5a5a5a` | `#5a5a58` | `#5a5856` | `#5a5b60` | `#4f4f4f` | `#a29f97` |

### Foregrounds

| Role | Meaning | Graphite | Classic | Espresso | Nautilus | Clay | Paper |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `fgSubtle` | Placeholders, ghost text, code lens, focus outlines, bright-black ANSI | `#6c6a6f` | `#6c6c68` | `#6c6a68` | `#6c6d72` | `#6d6b67` | `#85827a` |
| `fgStatus` | Status bar text only | `#6e6c71` | `#6e6e6a` | `#6e6c6a` | `#6e6f74` | `#7b7974` | `#77746c` |
| `fgMuted` | Secondary labels, icons, inactive tabs, breadcrumbs, punctuation | `#8b888f` | `#8b8b87` | `#8b8886` | `#8c8d92` | `#898781` | `#65625b` |
| `fgSidebar` | Side bar text only | `#8e8b93` | `#8e8e8a` | `#8e8c89` | `#8e8f94` | `#a5a49a` | `#615e57` |
| `fgSecondary` | Activity bar icons, widget text, active line number, selection tint, scrollbar thumb | `#bab6c0` | `#babab4` | `#bab8b4` | `#b9b8be` | `#c3c2b7` | `#46443f` |
| `fg` | Primary text, cursor, and the neutral tint for hover, selection, and match highlights | `#f7f1ff` | `#f0f0ea` | `#eceae6` | `#d8dbe1` | `#f0efec` | `#2b2a27` |
| `brightFg` | Strongest foreground: faint menubar selection tint, bright-white ANSI | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` | `#f9f9f7` | `#141412` |

### Semantic and accent colors

| Role | Meaning | Graphite | Classic | Espresso | Nautilus | Clay | Paper |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `accent` | Primary accent: active tab/panel text, list and quick-pick selection, find/focus highlights, light bulb, strings, Chrome NTP links | `#f0a84a` | `#ddb860` | `#c89878` | `#5278a0` | `#d97757` | `#8a5e10` |
| `error` | Errors, deletions, badges, keywords, tags | `#fc618d` | `#fc618d` | `#fc618d` | `#fc618d` | `#fc618d` | `#b03c5e` |
| `warning` | Warnings, conflicts, modified files, parameters | `#fd9353` | `#fd9353` | `#fd9353` | `#fd9353` | `#fd9353` | `#a15018` |
| `success` | Success, additions, checkboxes and radios, test run actions, functions | `#7bd88f` | `#7bd88f` | `#7bd88f` | `#7bd88f` | `#7bd88f` | `#2b743f` |
| `info` | Info, renamed files, links, types, classes, attributes | `#5ad4e6` | `#5ad4e6` | `#5ad4e6` | `#5ad4e6` | `#5ad4e6` | `#23707b` |
| `purple` | Hints, settings headers and modified indicators, numbers, constants, booleans | `#948ae3` | `#948ae3` | `#948ae3` | `#948ae3` | `#948ae3` | `#6657b6` |

### Fixed colors

| Role | Meaning | Value (all variants) |
| --- | --- | --- |
| `pureRed` | Offline status, diff move borders | `#ff0000` |

## Derived colors

### Alpha levels

Translucent colors are a role plus a fixed alpha suffix. Reuse these levels:

| Suffix | Opacity | Typical use |
| --- | --- | --- |
| `00` | 0% | Hide a border or background (`#00000000`) |
| `0c` | ~5% | `fg` hover/line highlight, faint row tints |
| `19` | ~10% | Diff and status backgrounds (added, deleted, error, warning) |
| `26` | ~15% | Selection, find matches, scrollbar thumb |
| `33` | 20% | Collaborator selection (Zed players) |
| `59` | 35% | Active scrollbar thumb |
| `7f` | 50% | Inlay hint text |
| `a5` | ~65% | Minimap and overview ruler markers |
| `bf` | 75% | Drop target backgrounds |

### ANSI dim colors

Dim terminal colors are the base role scaled to 70% brightness per channel (`Math.round(channel * 0.7)`): dim red from `error`, dim green from `success`, dim yellow from `accent`, dim blue from `warning`, dim magenta from `purple`, dim cyan from `info`.

### Derived grays

Off-palette grays are a palette role plus a fixed per-channel offset, chosen so Graphite reproduces its hand-authored value exactly while other variants inherit their tint. Shared helpers live in `src/palettes/color.ts`.

| Name | Formula | Graphite value | Use |
| --- | --- | --- | --- |
| `commentGray` | `fgSubtle` - 3 (light: + 3) | `#69676c` | Syntax comments (VS Code, Zed); ignored/unreachable (Zed) |
| `elevatedSurface` | `chromeBg` + 2 | `#1e1e1e` | Zed `elevated_surface.background` |
| `disabledGray` | `editorBg` + 4 (light: - 4) | `#2c2c2c` | Zed disabled borders, pane borders, dim black |
| `focusBorder` | Per variant (Graphite `#56545a`, Classic `#565458`, Espresso `#565256`, Nautilus `#57575d`, Clay `#5a5a5a`, Paper `#aba8a0`) | `#56545a` | Zed focused borders |
| NTP background | `chromeBg` - 10 | `[18, 18, 18]` | Chrome `ntp_background` |
| Toolbar | `editorBg` + 8 (light: + 0) | `[48, 48, 48]` | Chrome `toolbar` (active tab) |
| Omnibox | `editorBg` + 24 (light: - 12) | `[64, 64, 64]` | Chrome `omnibox_background` |
| Dim text | `editorBg` + 160 (light: - 160) | `[200, 200, 200]` | Chrome inactive tab text, toolbar icons |
| Tab text | `editorBg` + 185 (light: - 185) | `[225, 225, 225]` | Chrome background tab text |
| Text | `editorBg` + 210 (light: - 210) | `[250, 250, 250]` | Chrome primary text |

## Cross-target mappings

Use these when building a new target so the same concept gets the same role everywhere.

### Syntax

VS Code and Zed both remap syntax colors per variant. Follow this table for new targets.

Syntax colors stay the same across variants. Every dark variant uses Graphite's exact `error`, `warning`, `success`, `info`, and `purple` values. Paper uses the same hues, darkened to keep about 4.6:1 contrast on its editor. Only `accent` (strings) and the neutral grays change per variant.

#### Code

| Role | Syntax categories |
| --- | --- |
| `error` | Keywords, storage modifiers, operators, tags, regex delimiters, special punctuation, invalid code |
| `warning` | Parameters, placeholders, symbols, interpolation, special strings, CSS/SCSS variables, deprecated code |
| `accent` | Strings, regex |
| `success` | Functions, methods, constructors |
| `info` | Types, storage types (`const`, `function`, `class`), classes, modules, namespaces, attributes, enums, inherited classes |
| `purple` | Numbers, constants, booleans, escapes, labels |
| `fg` | Variables, properties, object keys, default text |
| `fgSecondary` | Built-in variables (`self`, `this`), vendor prefixes |
| `fgMuted` | Punctuation, brackets, delimiters |
| `commentGray` | Comments, doc comments (italic) |

#### CSS

| Role | Selector |
| --- | --- |
| `error` | Tag selectors |
| `success` | Class selectors |
| `warning` | ID selectors |
| `info` | Pseudo-classes and pseudo-elements (italic) |

#### Markup and diffs

| Role | Categories |
| --- | --- |
| `accent` | Headings, changed lines |
| `error` | Link text, markup punctuation, deleted lines |
| `success` | Link URLs, inserted lines |
| `warning` | Inline code and raw blocks, list markers |
| `fgMuted` | Ignored and untracked lines |
| `fg` | Emphasis and strong text (style only, no color change) |

#### Fixed syntax colors

These VS Code token colors are not palette roles and stay identical in every variant:

| Value | Scope |
| --- | --- |
| `#525053` | `constant.numeric.line-number.find-in-files` |
| `#6796e6` | `token.info-token` |
| `#cd9731` | `token.warn-token` |
| `#f44747` | `token.error-token` |
| `#b267e6` | `token.debug-token` |

### Terminal ANSI

| ANSI color | Role |
| --- | --- |
| black | `surfaceBg` |
| red / bright red | `error` |
| green / bright green | `success` |
| yellow / bright yellow | `accent` |
| blue / bright blue | `warning` (Monokai Pro convention; Zenkai has no blue role) |
| magenta / bright magenta | `purple` |
| cyan / bright cyan | `info` |
| white | `fg` |
| bright black | `fgSubtle` |
| bright white | `brightFg` |
| background | `surfaceBg` (VS Code), `editorBg` (Zed) |

### Version control and diagnostics

| Concept | Role |
| --- | --- |
| Added / created / success | `success` |
| Deleted / error | `error` |
| Modified | `warning` |
| Conflict / warning | `warning` |
| Renamed / info | `info` |
| Hint | `purple` |
| Ignored / hidden | `fgMuted` or `commentGray` |

### UI accents

Zenkai spreads workbench accents across several roles instead of one. Follow this grouping in new targets.

| UI group | Role |
| --- | --- |
| Active tab and panel title text | `accent` |
| List, menu, and quick-pick selection text | `accent` |
| Find and focus highlights, light bulb | `accent` |
| Badges (activity bar, panel title, agents) | `error` |
| Links (Zed: link hover) | `info` |
| Checkboxes, radios, settings checkboxes | `success` |
| Test run actions | `success` |
| Settings headers and modified indicators | `purple` |
| Git modified files, gutter, and minimap (Zed: `modified`) | `warning` |

### Ordered accent sets

Bracket pair colors (VS Code) and Zed `accents` use the same order: `error`, `warning`, `accent`, `success`, `info`, `purple`. Zed `players` 0 to 3 use `error`, `success`, `info`, `purple`.

## Target notes

- **VS Code:** Workbench `colors` and `tokenColors` are both remapped.
- **Zed:** The entire `style` object is remapped, including syntax and terminal colors, plus the derived grays above.
- **Chrome:** Colors are `[r, g, b]` arrays. Frame, tabs, NTP header, and buttons use `overlayBg`; toolbar, omnibox, NTP background, and text use the derived grays above. NTP links use `accent`. Taglines live in `taglineById` in `src/generators/chrome.ts`.

## Adding a new target

1. Hand-author `src/bases/<target>.json` using only Graphite palette values (and the derived colors above) for anything that should vary per variant. Use off-palette values only for colors that should stay identical across variants.
2. Pick roles by meaning, using the role tables and cross-target mappings above. Keep the background brightness ladder intact.
3. Add `src/generators/<target>.ts` that follows the existing generators: read the separate Graphite base input, reverse-map values to roles, substitute each variant from the shared registry, preserve alpha, and convert the color format if needed (see `src/palettes/color.ts`). Write outputs under `themes/<target>/`.
4. Register the generator in `src/generators/index.ts`.
5. Run `npm run generate` in `themes/vscode` and check that the Classic, Espresso, Nautilus, Clay, and Paper outputs differ from Graphite only where expected.

## Adding a new variant

1. Add `src/palettes/variants/<id>.ts` with every `ThemePalette` role, keeping the background ladder order (reversed for light variants). For a light variant, follow [Light variants](#light-variants).
2. Add it to the shared `variants` list in `src/palettes/index.ts`, `taglineById` in `src/generators/chrome.ts`, `focusBorderById` in `src/generators/zed.ts`, `contributes.themes` in `themes/vscode/package.json` (`uiTheme` `vs` for light), `SUPPORTED_THEMES` and `ThemeName` in `themes/vscode/src/customization/`, and `themes` in `themes/zed/extension.toml`.
3. Run `npm run generate` and `npm test` from `themes/vscode`.
