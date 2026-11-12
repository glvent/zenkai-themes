// Normalize theme colors that may already include alpha channels.
export function normalizeHex(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  return /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(trimmed) ? trimmed.toLowerCase() : "";
}

// Replace the alpha channel on a normalized color while leaving RGB untouched.
export function withAlpha(hexColor: string, alphaHex: string): string {
  const normalized = normalizeHex(hexColor);

  if (!normalized || !/^[0-9a-fA-F]{2}$/.test(alphaHex)) {
    return normalized;
  }

  return `${normalized.slice(0, 7)}${alphaHex.toLowerCase()}`;
}

// Shared numeric guard used throughout normalization and color math.
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Popup transparency is user-facing decimal input on a 0..1 scale.
export function normalizeUnitInterval(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return clamp(value, 0, 1);
}

// VS Code alpha uses the same 0..1 scale but expects an 8-bit channel value.
export function alphaFromTransparency(transparency: number): string {
  return toHexByte(255 * clamp(transparency, 0, 1));
}

function toHexByte(value: number): string {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
}

// Alpha suffix of an 8-digit color, or null for opaque 6-digit colors.
export function getAlphaChannel(value: string): string | null {
  const normalized = normalizeHex(value);
  return normalized.length === 9 ? normalized.slice(7) : null;
}

// Blend two colors in RGB space; `amount` 0 keeps `from`, 1 returns `to`. Keeps `from`'s alpha.
export function mixHex(from: string, to: string, amount: number): string {
  const a = normalizeHex(from);
  const b = normalizeHex(to);

  if (!a || !b) {
    return a;
  }

  const t = clamp(amount, 0, 1);
  let rgb = "#";
  for (let i = 1; i < 7; i += 2) {
    const x = parseInt(a.slice(i, i + 2), 16);
    const y = parseInt(b.slice(i, i + 2), 16);
    rgb += toHexByte(x + (y - x) * t);
  }

  return rgb + a.slice(7);
}
