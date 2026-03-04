import { DEFAULT_SETTINGS, mergeSettings, ModevolSettings } from "../src/settings";

test("mergeSettings keeps defaults when saved is null", () => {
  const merged = mergeSettings(DEFAULT_SETTINGS, null);
  expect(merged.labels.length).toBe(DEFAULT_SETTINGS.labels.length);
});

test("mergeSettings overrides existing label by key", () => {
  const saved: ModevolSettings = {
    labels: [
      {
        key: "d",
        name: "自定义描述",
        color: "#000000",
        svgIcon: "",
        enabled: false
      }
    ]
  };
  const merged = mergeSettings(DEFAULT_SETTINGS, saved);
  const d = merged.labels.find(l => l.key === "d");
  expect(d).toBeDefined();
  if (!d) return;
  expect(d.name).toBe("自定义描述");
  expect(d.color).toBe("#000000");
  expect(d.enabled).toBe(false);
});

test("mergeSettings preserves default labels when saved has subset", () => {
  const saved: ModevolSettings = {
    labels: [
      {
        key: "d",
        name: "自定义描述",
        color: "#000000",
        svgIcon: "",
        enabled: true
      }
    ]
  };
  const merged = mergeSettings(DEFAULT_SETTINGS, saved);
  const allKeys = merged.labels.map(l => l.key);
  expect(allKeys).toContain("d");
  expect(allKeys).toContain("c");
});

