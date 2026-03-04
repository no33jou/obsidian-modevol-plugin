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
import { setLabelConfigs, __getInterpreterForTest } from "../src/StateField";
import { LabelConfig } from "../src/settings";

describe("Bug 6: label configuration updates propagate to interpreter", () => {
  it("updates interpreter when setLabelConfigs is called again", () => {
    const configsD: LabelConfig[] = [
      { key: "d", name: "描述", color: "#4B99D3", svgIcon: "", enabled: true },
    ];
    const configsE: LabelConfig[] = [
      { key: "e", name: "例子", color: "#CD5255", svgIcon: "", enabled: true },
    ];

    setLabelConfigs(configsD);
    const first = __getInterpreterForTest();
    expect(first).toBeInstanceOf(ExpressionInterpreter);
    if (!first) return;

    expect(first.matchLine("#d 标题")).not.toBeNull();
    expect(first.matchLine("#e 标题")).toBeNull();

    setLabelConfigs(configsE);
    const second = __getInterpreterForTest();
    expect(second).toBeInstanceOf(ExpressionInterpreter);
    if (!second) return;
    expect(second).not.toBe(first);

    expect(second.matchLine("#e 标题")).not.toBeNull();
    expect(second.matchLine("#d 标题")).toBeNull();
  });
});
