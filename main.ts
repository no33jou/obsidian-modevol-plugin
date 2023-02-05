import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { viewPlugin } from 'LabelViewPlugin'
import { labelField } from 'StateField';
// Remember to rename these classes and interfaces!

export default class ModevolPlugin extends Plugin {

	async onload() {
		// 添加底部状态栏 
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');
		
		this.registerEditorExtension([labelField])
	}

	onunload() {

	}
}
