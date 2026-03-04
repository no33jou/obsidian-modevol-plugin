import { LabelConfig } from './settings';
import { hexToRgba } from './colorUtils';

export class StyleManager {
    private styleEl: HTMLStyleElement | null = null;

    constructor() {
        this.styleEl = null;
    }

    generateStyles(labels: LabelConfig[]): string {
        let css = ':root {\n';

        labels.forEach(label => {
            if (!label.enabled) {
                return;
            }
            const key = label.key;
            const color = label.color;
            const rgba = hexToRgba(color, 0.3);
            css += `    --modevol-${key}-color: ${color};\n`;
            css += `    --modevol-${key}-background-color: ${rgba};\n`;
        });

        css += '}\n\n';

        labels.forEach(label => {
            if (!label.enabled) {
                return;
            }
            const key = label.key;
            css += `.mv-label-${key} {\n`;
            css += `    color: var(--modevol-${key}-color);\n`;
            css += `    background-color: var(--modevol-${key}-background-color);\n`;
            css += `    border-color: var(--modevol-${key}-color);\n`;
            css += '}\n\n';
            css += `.mv-pre-label.mv-${key} {\n`;
            css += `    color: var(--modevol-${key}-color);\n`;
            css += '}\n\n';
        });

        return css;
    }

    injectStyles(labels: LabelConfig[]): void {
        // 移除旧样式
        this.removeStyles();

        // 生成新样式
        const css = this.generateStyles(labels);

        // 创建并插入新样式
        this.styleEl = document.createElement('style');
        this.styleEl.id = 'modevol-dynamic-styles';
        this.styleEl.textContent = css;
        document.head.appendChild(this.styleEl);
    }

    removeStyles(): void {
        if (this.styleEl && this.styleEl.parentNode) {
            this.styleEl.parentNode.removeChild(this.styleEl);
            this.styleEl = null;
        }

        // 也尝试通过 ID 移除（防止遗留）
        const existingStyle = document.getElementById('modevol-dynamic-styles');
        if (existingStyle && existingStyle.parentNode) {
            existingStyle.parentNode.removeChild(existingStyle);
        }
    }
}
