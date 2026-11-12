import * as vscode from "vscode";

import {
  SETTINGS_NAMESPACE,
  buildColorCustomizations,
  getSupportedThemeNames,
  normalizeSettings,
} from "./customization";
import type { RawSettings, ThemeName } from "./customization/types";

const supportedThemeNames = new Set<ThemeName>(getSupportedThemeNames());

// "Zenkai Clay" -> "accent.clay"
function accentSettingKey(themeName: ThemeName): string {
  return `accent.${themeName.replace("Zenkai ", "").toLowerCase()}`;
}

export function activate(context: vscode.ExtensionContext): void {
  let isApplying = false;
  let pendingRun: Promise<void> = Promise.resolve();

  const scheduleApply = (): void => {
    pendingRun = pendingRun
      .then(async () => {
        if (isApplying) {
          return;
        }

        const workbenchConfig = vscode.workspace.getConfiguration("workbench");
        const activeThemeName = workbenchConfig.get<string>("colorTheme");

        if (!activeThemeName || !supportedThemeNames.has(activeThemeName as ThemeName)) {
          return;
        }

        const zenkaiConfig = vscode.workspace.getConfiguration(SETTINGS_NAMESPACE);
        const accentPresets: RawSettings["accentPresets"] = {};
        for (const themeName of supportedThemeNames) {
          accentPresets[themeName] = zenkaiConfig.get(accentSettingKey(themeName));
        }

        const settings = normalizeSettings({
          accentCustomColor: zenkaiConfig.get("accentCustomColor"),
          accentPresets,
          borderContrast: zenkaiConfig.get("borderContrast"),
          popupTransparency: zenkaiConfig.get("popupTransparency"),
          terminalMatchLocation: zenkaiConfig.get("terminalMatchLocation"),
        } satisfies RawSettings);

        const currentCustomizations =
          workbenchConfig.get<Record<string, unknown>>("colorCustomizations") ?? {};
        const nextCustomizations = buildColorCustomizations(
          currentCustomizations,
          activeThemeName as ThemeName,
          settings
        );

        if (JSON.stringify(currentCustomizations) === JSON.stringify(nextCustomizations)) {
          return;
        }

        isApplying = true;
        try {
          await workbenchConfig.update(
            "colorCustomizations",
            nextCustomizations,
            vscode.ConfigurationTarget.Global
          );
        } finally {
          isApplying = false;
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to sync Zenkai theme customizations.", error);
      });
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (isApplying && event.affectsConfiguration("workbench.colorCustomizations")) {
        return;
      }

      if (
        event.affectsConfiguration("workbench.colorTheme") ||
        event.affectsConfiguration("workbench.colorCustomizations") ||
        event.affectsConfiguration(SETTINGS_NAMESPACE)
      ) {
        scheduleApply();
      }
    })
  );

  context.subscriptions.push(vscode.window.onDidChangeActiveColorTheme(() => scheduleApply()));

  scheduleApply();
}

export function deactivate(): void {}
