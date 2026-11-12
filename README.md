# Zenkai

A minimal, muted theme forked from Monokai Pro, with five dark variants and one light variant. Available for **VS Code**, **Zed**, and **Chrome**.

---

## Variants

| Variant      | Character               | Background                                | Accent                                    |
| ------------ | ----------------------- | ----------------------------------------- | ----------------------------------------- |
| **Graphite** | Neutral gray            | ![](assets/swatches/282828.svg) `#282828` | ![](assets/swatches/f0a84a.svg) `#f0a84a` |
| **Classic**  | Warm olive cast         | ![](assets/swatches/282826.svg) `#282826` | ![](assets/swatches/ddb860.svg) `#ddb860` |
| **Espresso** | Warm brown cast         | ![](assets/swatches/282724.svg) `#282724` | ![](assets/swatches/c89878.svg) `#c89878` |
| **Nautilus** | Cool blue-gray cast     | ![](assets/swatches/292a2d.svg) `#292a2d` | ![](assets/swatches/5278a0.svg) `#5278a0` |
| **Clay**     | Near-black, blue accent | ![](assets/swatches/202020.svg) `#202020` | ![](assets/swatches/6a9bcc.svg) `#6a9bcc` |
| **Paper**    | Light, warm off-white   | ![](assets/swatches/e9e7e1.svg) `#e9e7e1` | ![](assets/swatches/8a5e10.svg) `#8a5e10` |

## Installation

### VS Code

```sh
cd themes/vscode
npm install
npm run install:local
```

This builds and tests the extension, packages a VSIX, and installs it into your running editor without changing the version. Then pick a theme with **Preferences: Color Theme**.

### Zed

1. Open the command palette and run **zed: install dev extension**.
2. Select the `themes/zed` folder.
3. Pick a theme with **theme selector: toggle**.

### Chrome

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked**.
3. Select a variant folder, such as `themes/chrome/zenkai-graphite`.

## VS Code settings

| Setting                        | Description                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `zenkai.popupTransparency`     | Popup menu opacity, from `0` to `1`                                                              |
| `zenkai.terminalMatchLocation` | _Experimental._ Match the terminal background to the panel or sidebar hosting it (VS Code 1.91+) |
| `zenkai.borderContrast`        | Border contrast: `Low`, `Default`, or `High`                                                     |
| `zenkai.accent.<variant>`      | Named accent preset per theme (graphite, classic, espresso, nautilus, clay, paper)               |
| `zenkai.accentCustomColor`     | Custom `#RRGGBB` accent for every Zenkai theme; overrides presets                                |

## Project layout

```
src/
├── palettes/       Shared roles, color helpers, and variant palettes
├── bases/          Hand-authored Graphite inputs for each target
└── generators/     VS Code, Zed, Chrome, and documentation swatches

themes/
├── vscode/
│   ├── src/        Extension runtime and customization module
│   ├── scripts/    Build orchestration and explicit installation
│   ├── test/       Runtime and build regression tests
│   ├── themes/     Generated theme JSON shipped with the extension
│   └── assets/     Extension icon
├── zed/            Zed extension and generated theme JSON
└── chrome/         Generated Chrome theme manifests
```

## Development commands

Run these from `themes/vscode`:

- `npm run build` — regenerate VS Code themes, compile runtime code, and type-check tooling.
- `npm test` — build the extension and run tests in a separate `.test-build/` directory.
- `npm run typecheck` — check runtime, tests, and shared generation tooling without emitting files.
- `npm run generate` — regenerate all targets and documentation swatches.
- `npm run package` — build, test, and create a VSIX without installing it.
- `npm run install:local` — package and install the current version into the running editor.
- `npm run version:patch` — explicitly bump the version in `package.json` and `package-lock.json` without creating a Git commit or tag.
- `npm run dev` — build, open an extension development host when a VS Code CLI is available, and watch runtime TypeScript. Palette or base changes require another build.

Builds never bump versions or reinstall extensions. Compiled runtime files live in `dist/`; tests and build tooling are excluded from the VSIX.

## Editing colors

All themes are generated from the shared palettes in `src/palettes/variants/` and the hand-authored Graphite inputs in `src/bases/`. Edit those sources, then regenerate everything:

```sh
cd themes/vscode
npm run generate
npm test
```

Every file under the target theme output directories is generated, including Graphite. Never edit those files directly; edit a palette or the corresponding base instead.

See [COLOR.md](COLOR.md) for the full color system: role definitions, derived colors, cross-target mappings, and how to add a new target or variant.
