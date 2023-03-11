import { ItemView, WorkspaceLeaf } from "obsidian";

import { App, createApp } from "vue";
import ModevolPlugin from "./main";
import Outline from './Outline.vue';

export const VIEW_TYPE = 'modevol-outline';
export class OutlineView extends ItemView {
    vueApp: App;
    plugin: ModevolPlugin;
    constructor(leaf: WorkspaceLeaf, plugin: ModevolPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Modevol Outline";
    }

    getIcon(): string {
        return "lines-of-text";
    }

    async onOpen(this: OutlineView) {
        const container = this.containerEl.children[1];
        container.empty();
        const mountPoint = container.createEl("div", {
            cls: "modevol-outline"
        });
        this.vueApp = createApp(Outline);
        this.vueApp.provide('plugin',this.plugin)
        this.vueApp.config.globalProperties.plugin = this.plugin;
        this.vueApp.config.globalProperties.container = mountPoint;
        this.vueApp.mount(mountPoint);
    }

    async onClose() {
        
    }
    onunload(): void {
        this.vueApp.unmount();
    }

}