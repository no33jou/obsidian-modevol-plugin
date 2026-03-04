export function hexToRgba(hex: string, alpha: number): string {
  let value = hex.trim();
  if (!value.startsWith("#")) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  value = value.substring(1);
  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (value.length === 8) {
    value = value.substring(0, 6);
  }
  if (value.length < 6) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(color.trim());
}

