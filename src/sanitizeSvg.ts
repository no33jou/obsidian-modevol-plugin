export function sanitizeSvg(svg: string): string {
  const trimmed = svg.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.toLowerCase().includes("<script")) {
    return "";
  }
  if (/on\w+=/i.test(trimmed)) {
    return "";
  }
  if (/javascript:/i.test(trimmed)) {
    return "";
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "image/svg+xml");
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      return "";
    }
    const root = doc.documentElement;
    if (!root || root.nodeName.toLowerCase() !== "svg") {
      return "";
    }
    const scripts = root.querySelectorAll("script");
    if (scripts.length > 0) {
      return "";
    }
    const elements = root.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        if (attr.name.toLowerCase().startsWith("on")) {
          el.removeAttribute(attr.name);
        }
        if (attr.value.toLowerCase().includes("javascript:")) {
          el.removeAttribute(attr.name);
        }
      }
    }
    return root.outerHTML;
  } catch {
    return "";
  }
}

export const __sanitizeSvgForTest = sanitizeSvg;
