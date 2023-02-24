import { ItemView } from "obsidian";

export const VIEW_TYPE: string = 'modevol-outline';
export class OutlineView extends ItemView{
    getViewType(): string {
        return VIEW_TYPE
    }
    getDisplayText(): string {
        return "Modevol Outline";
    }
    getIcon(): string {
        return "lines-of-text";
    }
    async onOpen() {
        
    }
}