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
		this.registerMarkdownPostProcessor((element, context) => {
			const tags = element.querySelectorAll('.tag')
			for (let index = 0; index < tags.length; index++) {
				const tag = tags.item(index)
				let pr = tag.previousSibling
				let next = tag.nextSibling
				if (pr != null && pr.doc && pr.textContent != '\n') {
					continue
				}

				switch (tag.textContent) {
					case '#d':
						tag.className = ' mv-label mv-label-d'
						tag.textContent = '描述'
						break
					case '#e':
						tag.className = ' mv-label mv-label-e'
						tag.textContent = '例子'
						break
					case '#v':
						tag.className = ' mv-label mv-label-v'
						tag.textContent = '验证'
						break
					case '#t':
						tag.className = ' mv-label mv-label-t'
						tag.textContent = '迁移'
						break
					case '#c':
						tag.className = ' mv-label mv-label-c'
						if (!next) break;
						let contentList = next.textContent?.trim().split(' ')
						if (contentList && contentList?.length > 0) {
							let tagName = contentList[0];
							tag.textContent = tagName;
							contentList = contentList.slice(1)
							next.textContent = ' ' + contentList.join(' ')
						}
						break;
					default:
						break;
				}
			}

		})
	}

	onunload() {

	}
}