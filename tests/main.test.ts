import { App, PluginManifest } from "obsidian";
import ModevolPlugin from "../src/main";

// Mock the obsidian module
jest.mock('obsidian', () => ({
    Plugin: class {
        app: App;
        manifest: PluginManifest;
        constructor(app: App, manifest: PluginManifest) {
            this.app = app;
            this.manifest = manifest;
        }
        registerEvent() { }
        registerView() { }
        addStatusBarItem() { }
        addSettingTab() { }
        addCommand() { }
        registerEditorExtension() { }
        registerMarkdownPostProcessor() { }
        loadData() { return Promise.resolve(null); }
        saveData() { return Promise.resolve(); }
    },
    debounce: (fn: any, wait: number) => fn,
    MarkdownView: class { },
    MarkdownRenderChild: class {
        containerEl: HTMLElement;
        constructor(containerEl: HTMLElement) {
            this.containerEl = containerEl;
        }
        onload() { }
        onunload() { }
        load() { }
        unload() { }
    },
    ItemView: class {
        app: App;
        constructor(leaf: unknown) { }
        getViewType() { return ""; }
        getDisplayText() { return ""; }
        onOpen() { return Promise.resolve(); }
        onClose() { return Promise.resolve(); }
    },
    PluginSettingTab: class {
        app: App;
        plugin: any;
        constructor(app: App, plugin: any) {
            this.app = app;
            this.plugin = plugin;
        }
        display() { }
        hide() { }
    },
    Modal: class {
        app: App;
        constructor(app: App) { this.app = app; }
        open() { }
        close() { }
        onOpen() { }
        onClose() { }
    }
}), { virtual: true });

describe("Bug 1: `this` context loss in main.ts", () => {
    it("refreshHeader should maintain `this` context when debounced", () => {
        const mockApp = {
            workspace: {
                getActiveFile: jest.fn().mockReturnValue(null) // Mock returning no file
            },
            metadataCache: {
                getFileCache: jest.fn()
            }
        } as unknown as App;
        const mockManifest = { id: "modevol", name: "modevol", version: "1.0.0", minAppVersion: "1.0.0" } as PluginManifest;

        const plugin = new ModevolPlugin(mockApp, mockManifest);

        // This invocation should not throw an error about 'this' being undefined
        expect(() => {
            plugin.refreshHeader();
        }).not.toThrow();

        expect(mockApp.workspace.getActiveFile).toHaveBeenCalled();
    });
});
