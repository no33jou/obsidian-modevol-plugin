import { DEFAULT_SETTINGS, mergeSettings, ModevolSettings } from "../src/settings";

describe("Bug 3: DEFAULT_SETTINGS color consistency", () => {
  function getColorByKey(key: string): string | undefined {
    const found = DEFAULT_SETTINGS.labels.find((l) => l.key === key);
    return found?.color;
  }

  it("matches original plugin colors for core labels", () => {
    expect(getColorByKey("d")).toBe("#4B99D3");
    expect(getColorByKey("e")).toBe("#CD5255");
    expect(getColorByKey("t")).toBe("#EBAB37");
    expect(getColorByKey("v")).toBe("#5572F1");
    expect(getColorByKey("c")).toBe("#C9C9C9");
  });
});

describe("Bug 9: mergeSettings deep merge behavior", () => {
  it("returns defaults when saved is null or not an object", () => {
    expect(mergeSettings(DEFAULT_SETTINGS, null)).toBe(DEFAULT_SETTINGS);
    expect(mergeSettings(DEFAULT_SETTINGS, 123 as unknown)).toBe(DEFAULT_SETTINGS);
  });

  it("merges partial user settings without losing default labels", () => {
    const saved: ModevolSettings = {
      labels: [
        {
          key: "d",
          name: "自定义描述",
          color: "#000000",
          svgIcon: "",
          enabled: false,
        },
        {
          key: "x",
          name: "新标签",
          color: "#111111",
          svgIcon: "",
          enabled: true,
        },
      ],
    };

    const merged = mergeSettings(DEFAULT_SETTINGS, saved);

    const byKey: Record<string, string> = {};
    merged.labels.forEach((l) => {
      byKey[l.key] = l.name;
    });

    expect(byKey["d"]).toBe("自定义描述");
    expect(merged.labels.find((l) => l.key === "d")?.color).toBe("#000000");
    expect(merged.labels.find((l) => l.key === "d")?.enabled).toBe(false);

    expect(byKey["x"]).toBe("新标签");

    ["s", "q", "e", "v", "t", "c"].forEach((key) => {
      expect(byKey[key]).toBeDefined();
    });
  });

  it("normalizes keys to lowercase and preserves custom flag defaults", () => {
    const saved: ModevolSettings = {
      labels: [
        {
          key: "C",
          name: "Custom Upper",
          color: "#222222",
          svgIcon: "",
          enabled: true,
        },
      ],
    };

    const merged = mergeSettings(DEFAULT_SETTINGS, saved);
    const custom = merged.labels.find((l) => l.key === "c");
    expect(custom).toBeDefined();
    if (!custom) return;
    expect(custom.name).toBe("Custom Upper");
    expect(custom.color).toBe("#222222");
    expect(custom.enabled).toBe(true);
    expect(custom.custom).toBe(true);
  });
});
