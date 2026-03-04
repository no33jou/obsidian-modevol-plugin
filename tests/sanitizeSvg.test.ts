jest.mock("obsidian", () => ({
  Plugin: class {
    app: any;
    manifest: any;
    constructor(app: any, manifest: any) {
      this.app = app;
      this.manifest = manifest;
    }
    registerEvent() {}
    registerView() {}
    addStatusBarItem() {}
    addSettingTab() {}
    addCommand() {}
    registerEditorExtension() {}
    registerMarkdownPostProcessor() {}
    loadData() {
      return Promise.resolve(null);
    }
    saveData() {
      return Promise.resolve();
    }
  },
  debounce: (fn: any) => fn,
  MarkdownView: class {},
  MarkdownRenderChild: class {
    containerEl: HTMLElement;
    constructor(containerEl: HTMLElement) {
      this.containerEl = containerEl;
    }
    onload() {}
    onunload() {}
    load() {}
    unload() {}
  },
  ItemView: class {
    app: any;
    constructor(leaf: unknown) {}
    getViewType() {
      return "";
    }
    getDisplayText() {
      return "";
    }
    onOpen() {
      return Promise.resolve();
    }
    onClose() {
      return Promise.resolve();
    }
  },
  PluginSettingTab: class {
    app: any;
    plugin: any;
    constructor(app: any, plugin: any) {
      this.app = app;
      this.plugin = plugin;
    }
    display() {}
    hide() {}
  },
  Modal: class {
    app: any;
    constructor(app: any) { this.app = app; }
    open() {}
    close() {}
    onOpen() {}
    onClose() {}
  },
}), { virtual: true });

import { __sanitizeSvgForTest as sanitizeWidgetSvg } from "../src/sanitizeSvg";
import { __sanitizeSvgForTest as sanitizeSettingSvg } from "../src/sanitizeSvg";
import { validateImportedSettings } from "../src/SettingTab";

describe("Bug 4: SVG sanitization", () => {
  const samples = [
    "<svg></svg>",
    '<svg><rect width="10" height="10"/></svg>',
  ];

  it("accepts simple safe SVG", () => {
    samples.forEach((svg) => {
      expect(sanitizeWidgetSvg(svg)).toContain("<svg");
      expect(sanitizeSettingSvg(svg)).toContain("<svg");
    });
  });

  it("rejects script tags", () => {
    const svg = '<svg><script>alert(1)</script></svg>';
    expect(sanitizeWidgetSvg(svg)).toBe("");
    expect(sanitizeSettingSvg(svg)).toBe("");
  });

  it("rejects inline event handlers", () => {
    const svg =
      '<svg><rect width="10" height="10" onclick="alert(1)"/></svg>';
    const w = sanitizeWidgetSvg(svg);
    const s = sanitizeSettingSvg(svg);
    expect(w).not.toContain("onclick=");
    expect(s).not.toContain("onclick=");
  });

  it("rejects javascript: URLs", () => {
    const svg =
      '<svg><a xlink:href="javascript:alert(1)"><rect width="10" height="10"/></a></svg>';
    const w = sanitizeWidgetSvg(svg);
    const s = sanitizeSettingSvg(svg);
    expect(w.toLowerCase()).not.toContain("javascript:");
    expect(s.toLowerCase()).not.toContain("javascript:");
  });
});

describe("Bug 4: validateImportedSettings safeguards", () => {
  it("returns null for invalid shapes", () => {
    expect(validateImportedSettings(null)).toBeNull();
    expect(validateImportedSettings({})).toBeNull();
    expect(validateImportedSettings({ labels: "not-array" })).toBeNull();
  });

  it("sanitizes colors and SVG fields", () => {
    const raw = {
      labels: [
        {
          key: "d",
          name: "描述",
          color: "#4B99D3",
          svgIcon: '<svg><rect width="10" height="10"/></svg>',
          enabled: true,
        },
        {
          key: "e",
          name: "恶意",
          color: "not-a-color",
          svgIcon: '<svg><script>alert(1)</script></svg>',
          enabled: true,
        },
      ],
    };

    const validated = validateImportedSettings(raw);
    expect(validated).not.toBeNull();
    if (!validated) return;

    expect(validated.labels.length).toBe(2);

    const d = validated.labels.find((l) => l.key === "d");
    const e = validated.labels.find((l) => l.key === "e");
    expect(d).toBeDefined();
    expect(e).toBeDefined();
    if (!d || !e) return;

    expect(d.color).toBe("#4B99D3");
    expect(d.svgIcon).toContain("<svg");

    expect(e.color).toBe("#999999");
    expect(e.svgIcon).toBe("");
  });
});
