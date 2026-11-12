import { generateChromeThemes } from "./chrome";
import { generateVscodeThemes } from "./vscode";
import { generateSwatches } from "./swatches";
import { generateTerminalThemes } from "./terminals";
import { generateZedThemes } from "./zed";

export function generateAllThemes(): void {
	generateVscodeThemes();
	generateZedThemes();
	generateChromeThemes();
	generateTerminalThemes();
	generateSwatches();
}
