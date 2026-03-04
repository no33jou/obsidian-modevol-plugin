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
}), { virtual: true });

import ExpressionInterpreter from "../src/ExpressionInterpreter";
import { LabelConfig } from "../src/settings";
import { isCustomTagSymbol, setLabelConfigs } from "../src/ModevolWidget";

describe("Bug 8: Custom label key is driven by config.custom", () => {
  function createConfigsWithCustomKey(key: string): LabelConfig[] {
    return [
      { key: "d", name: "描述", color: "#4B99D3", svgIcon: "", enabled: true },
      {
        key,
        name: "自定义",
        color: "#C9C9C9",
        svgIcon: "",
        enabled: true,
        custom: true,
      },
    ];
  }

  it("ExpressionInterpreter treats configured custom key as custom", () => {
    const configs = createConfigsWithCustomKey("z");
    const interpreter = new ExpressionInterpreter(configs);
    const match = interpreter.matchLine("#z 名称 标题 关系");
    expect(match).not.toBeNull();
    if (!match) return;
    const label = interpreter.getLabel(match);
    expect(label).toBeDefined();
    if (!label) return;
    expect(label.type).toBe("z");
    expect(label.tagName).toBe("名称");
    expect(label.title).toBe("标题");
    expect(label.relation).toBe("关系");
  });

  it("ModevolWidget uses custom flag instead of hardcoded '#c'", () => {
    const configs = createConfigsWithCustomKey("z");
    setLabelConfigs(configs);
    expect(isCustomTagSymbol("#z")).toBe(true);
    expect(isCustomTagSymbol("#d")).toBe(false);
    expect(isCustomTagSymbol("#c")).toBe(false);
  });
});
