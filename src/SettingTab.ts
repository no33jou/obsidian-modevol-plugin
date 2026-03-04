import { App, PluginSettingTab, Setting, Notice, Modal } from 'obsidian';
import ModevolPlugin from './main';
import { LabelConfig } from './settings';
import { hexToRgba } from './colorUtils';
import { sanitizeSvg } from './sanitizeSvg';

class InputLabelKeyModal extends Modal {
    private result: string = '';
    private defaultKeyVal;
    private resolve: (value: string) => void;

    constructor(app: App, defaultKey: string) {
        super(app);
        this.defaultKeyVal = defaultKey;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: '输入标签字母' });
        contentEl.createEl('p', { text: `请输入单个英文字母（a-z），默认: ${this.defaultKeyVal}` });

        const input = contentEl.createEl('input', {
            type: 'text',
            cls: 'modevol-key-input'
        });
        input.value = this.defaultKeyVal;
        input.maxLength = 1;

        const buttonContainer = contentEl.createDiv({ cls: 'modevol-modal-buttons' });
        
        const confirmBtn = buttonContainer.createEl('button', { text: '确定' });
        const cancelBtn = buttonContainer.createEl('button', { text: '取消' });

        confirmBtn.addEventListener('click', () => {
            const value = input.value.toLowerCase().trim();
            if (!value || value.length !== 1 || !/^[a-z]$/i.test(value)) {
                new Notice('请输入单个英文字母');
                return;
            }
            this.result = value;
            this.close();
        });

        cancelBtn.addEventListener('click', () => {
            this.result = '';
            this.close();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                confirmBtn.click();
            } else if (e.key === 'Escape') {
                cancelBtn.click();
            }
        });

        setTimeout(() => input.focus(), 100);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        super.onClose();
    }

    getResult(): string {
        return this.result;
    }
}

export class ModevolSettingTab extends PluginSettingTab {
    plugin: ModevolPlugin;

    constructor(app: App, plugin: ModevolPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Modevol 标签配置' });

        // 添加说明
        containerEl.createEl('p', {
            text: '自定义标签字母、颜色和图标。修改后需要重新打开文档才能看到效果。',
            cls: 'setting-item-description'
        });

        // 添加新标签按钮
        new Setting(containerEl)
            .setName('添加新标签')
            .setDesc('创建一个新的自定义标签')
            .addButton(button => button
                .setButtonText('添加标签')
                .setCta()
                .onClick(() => {
                    this.addNewLabel();
                }));

        // 显示所有标签配置
        this.plugin.settings.labels.forEach((label, index) => {
            this.createLabelSetting(containerEl, label, index);
        });

        // 导入导出功能
        containerEl.createEl('h3', { text: '导入/导出配置' });

        new Setting(containerEl)
            .setName('导出配置')
            .setDesc('将当前标签配置导出为 JSON 文件')
            .addButton(button => button
                .setButtonText('导出')
                .onClick(() => {
                    this.exportSettings();
                }));

        new Setting(containerEl)
            .setName('导入配置')
            .setDesc('从 JSON 文件导入标签配置')
            .addButton(button => button
                .setButtonText('导入')
                .onClick(() => {
                    this.importSettings();
                }));
    }

    createLabelSetting(containerEl: HTMLElement, label: LabelConfig, index: number): void {
        const settingDiv = containerEl.createDiv({ cls: 'modevol-label-setting' });

        // 标签标题
        settingDiv.createEl('h4', { text: `标签 #${label.key}` });

        // 启用/禁用开关
        new Setting(settingDiv)
            .setName('启用')
            .setDesc('是否启用此标签')
            .addToggle(toggle => toggle
                .setValue(label.enabled)
                .onChange(async (value) => {
                    this.plugin.settings.labels[index].enabled = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshStyles();
                }));

        // 自定义模式开关
        new Setting(settingDiv)
            .setName('自定义模式')
            .setDesc('自定义模式的标签会显示用户指定的名称，而非固定的显示名称')
            .addToggle(toggle => toggle
                .setValue(label.custom || false)
                .onChange(async (value) => {
                    this.plugin.settings.labels[index].custom = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshStyles();
                    this.display(); // 重新渲染界面
                }));

        // 标签字母
        new Setting(settingDiv)
            .setName('标签字母')
            .setDesc('单个字母，如 d, s, q')
            .addText(text => text
                .setPlaceholder('输入单个字母')
                .setValue(label.key)
                .onChange(async (value) => {
                    // 验证输入
                    if (value.length !== 1 || !/^[a-z]$/i.test(value)) {
                        new Notice('标签字母必须是单个英文字母');
                        return;
                    }
                    // 检查重复
                    const duplicate = this.plugin.settings.labels.some((l, i) =>
                        i !== index && l.key === value.toLowerCase()
                    );
                    if (duplicate) {
                        new Notice('标签字母已存在');
                        return;
                    }
                    this.plugin.settings.labels[index].key = value.toLowerCase();
                    await this.plugin.saveSettings();
                    this.plugin.refreshStyles();
                    this.display(); // 重新显示以更新标题
                }));

        // 显示名称 - 非自定义模式时显示
        if (!label.custom) {
            new Setting(settingDiv)
                .setName('显示名称')
                .setDesc('标签的中文名称，如"描述"、"总结"')
                .addText(text => text
                    .setPlaceholder('输入显示名称')
                    .setValue(label.name)
                    .onChange(async (value) => {
                        this.plugin.settings.labels[index].name = value;
                        await this.plugin.saveSettings();
                    }));
        }

        // 颜色选择
        // 预览区域
        const previewDiv = settingDiv.createDiv({ cls: 'modevol-label-preview' });
        this.updatePreview(previewDiv, label);
        
        new Setting(settingDiv)
            .setName('文本颜色')
            .setDesc('标签的文本颜色')
            .addColorPicker(color => color
                .setValue(label.color)
                .onChange(async (value) => {
                    if (!validateColorValue(value)) {
                        new Notice('请输入有效的十六进制颜色值（如 #FF0000）');
                        return;
                    }
                    this.plugin.settings.labels[index].color = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshStyles();
                    this.updatePreview(previewDiv, this.plugin.settings.labels[index]);
                }));

        // SVG 图标
        new Setting(settingDiv)
            .setName('SVG 图标')
            .setDesc('标签的 SVG 图标代码（用于阅读模式）')
            .addTextArea(text => {
                text.setPlaceholder('粘贴 SVG 代码')
                    .setValue(label.svgIcon)
                    .onChange(async (value) => {
                        this.plugin.settings.labels[index].svgIcon = value;
                        await this.plugin.saveSettings();
                        this.updatePreview(previewDiv, this.plugin.settings.labels[index]);
                    });
                text.inputEl.rows = 4;
                text.inputEl.style.fontFamily = 'monospace';
                text.inputEl.style.fontSize = '12px';
            });

        // 删除按钮
        new Setting(settingDiv)
            .addButton(button => button
                .setButtonText('删除此标签')
                .setWarning()
                .onClick(async () => {
                    if (confirm(`确定要删除标签 #${label.key} 吗？`)) {
                        this.plugin.settings.labels.splice(index, 1);
                        await this.plugin.saveSettings();
                        this.plugin.refreshStyles();
                        this.display();
                        new Notice('标签已删除');
                    }
                }));

        settingDiv.createEl('hr');
    }

    updatePreview(containerEl: HTMLElement, label: LabelConfig): void {
        containerEl.empty();
        containerEl.createEl('strong', { text: '预览: ' });

        const previewSpan = containerEl.createEl('span', {
            cls: 'modevol-preview-label',
            text: `#${label.key} 示例文本`
        });

        previewSpan.style.color = label.color;
        previewSpan.style.border = `1px solid ${label.color}`;
        previewSpan.style.borderRadius = '3px';
        previewSpan.style.padding = '2px 6px';
        previewSpan.style.marginLeft = '8px';
        previewSpan.style.backgroundColor = hexToRgba(label.color, 0.1);

        // 显示图标预览
        if (label.svgIcon) {
            const iconDiv = containerEl.createDiv({ cls: 'modevol-preview-icon' });
            const sanitized = sanitizeSvg(label.svgIcon);
            if (sanitized) {
                iconDiv.innerHTML = sanitized;
            }
            iconDiv.style.marginTop = '8px';
        }
    }

    addNewLabel(): void {
        const usedKeys = new Set(this.plugin.settings.labels.map(l => l.key));
        const availableKeys: string[] = [];
        for (let i = 97; i <= 122; i++) {
            const char = String.fromCharCode(i);
            if (!usedKeys.has(char)) {
                availableKeys.push(char);
            }
        }

        if (availableKeys.length === 0) {
            new Notice('已达到最大标签数量（26个）');
            return;
        }

        const modal = new InputLabelKeyModal(this.app, availableKeys[0]);
        modal.open();

        modal.onClose = () => {
            const key = modal.getResult();
            if (!key) return;

            if (usedKeys.has(key)) {
                new Notice('该标签字母已存在');
                return;
            }

            const newLabel: LabelConfig = {
                key: key,
                name: '新标签',
                color: '#999999',
                svgIcon: `<svg fill="none" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em"><circle cx="24" cy="24" r="12" fill="none" stroke="#999999" stroke-width="3"></circle></svg>`,
                enabled: true
            };

            this.plugin.settings.labels.push(newLabel);
            this.plugin.saveSettings();
            this.plugin.refreshStyles();
            this.display();
            new Notice(`已添加新标签 #${key}`);
        };
    }

    exportSettings(): void {
        const dataStr = JSON.stringify(this.plugin.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'modevol-settings.json';
        link.click();
        URL.revokeObjectURL(url);
        new Notice('配置已导出');
    }

    importSettings(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const imported = JSON.parse(text);
                const validated = validateImportedSettings(imported);
                if (!validated) {
                    new Notice('无效的配置文件格式');
                    return;
                }
                if (confirm('导入配置将覆盖当前设置，是否继续？')) {
                    this.plugin.settings = validated;
                    await this.plugin.saveSettings();
                    this.plugin.refreshStyles();
                    this.display();
                    new Notice('配置已导入');
                }
            } catch (error) {
                console.error('导入配置失败:', error);
                new Notice('导入配置失败，请检查文件格式');
            }
        };
        input.click();
    }
}

function validateColorValue(value: unknown): value is string {
    if (typeof value !== 'string') {
        return false;
    }
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());
}

export function validateImportedSettings(raw: unknown): { labels: LabelConfig[] } | null {
    if (!raw || typeof raw !== 'object') {
        return null;
    }
    const anyRaw = raw as { labels?: unknown };
    if (!Array.isArray(anyRaw.labels)) {
        return null;
    }
    const result: LabelConfig[] = [];
    for (const item of anyRaw.labels) {
        if (!item || typeof item !== 'object') {
            continue;
        }
        const anyItem = item as Partial<LabelConfig>;
        if (typeof anyItem.key !== 'string' || anyItem.key.length !== 1 || !/^[a-z]$/i.test(anyItem.key)) {
            continue;
        }
        const key = anyItem.key.toLowerCase();
        const name = typeof anyItem.name === 'string' ? anyItem.name : key;
        const color = validateColorValue(anyItem.color) ? anyItem.color : '#999999';
        const svgSource = typeof anyItem.svgIcon === 'string' ? anyItem.svgIcon : '';
        const svgIcon = svgSource ? sanitizeSvg(svgSource) : '';
        const enabled = typeof anyItem.enabled === 'boolean' ? anyItem.enabled : true;
        result.push({ key, name, color, svgIcon, enabled });
    }
    if (result.length === 0) {
        return null;
    }
    return { labels: result };
}
