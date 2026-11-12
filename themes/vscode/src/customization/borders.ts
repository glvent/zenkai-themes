export const BORDER_CONTRAST_DEFAULT = "Default" as const;

// Each level blends the neutral borders toward a theme color: the editor background
// (softer) or the foreground (stronger). package.json enums are checked against this in tests.
export const BORDER_CONTRAST_LEVELS: Readonly<
  Record<string, { target: "background" | "foreground"; amount: number }>
> = Object.freeze({
  Low: { target: "background", amount: 0.5 },
  High: { target: "foreground", amount: 0.15 },
});

export const BORDER_CONTRAST_OPTIONS = Object.freeze([
  "Low",
  BORDER_CONTRAST_DEFAULT,
  "High",
]) as readonly string[];
