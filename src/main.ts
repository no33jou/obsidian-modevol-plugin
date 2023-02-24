
import * as CodeMirror from 'codemirror';
import { App, Editor, MarkdownFileInfo, MarkdownPostProcessorContext, MarkdownView, Plugin } from 'obsidian';
import { labelField, labels } from 'src/StateField';
let labelStatusBar:HTMLElement| null = null
export default class ModevolPlugin extends Plugin {
	async onload() {
		// 添加底部状态栏 
		const item = this.addStatusBarItem()
		labelStatusBar = item.createSpan({text:'Modevol'});

		this.registerEvent(this.app.workspace.on('editor-change', this.editorChange))
		this.registerEditorExtension([labelField])
		this.registerMarkdownPostProcessor(MarkdownPostProcessor)
		
		this.registerCodeMirror(this.getModeNameFromCodeMirror)
		
		this.app.workspace.on('layout-change', () => {
			
			console.log('layout-change')
		  });

		CodeMirror.extendMode('markdown',{
			token(stream, state) {
				console.log(stream)
				console.log(state)
			   return null 
			},
			startState() {
				
			},
		});
		
	}
	getModeNameFromCodeMirror(cm:CodeMirror.Editor){
		console.log(`codemirror`)
		console.log(cm)
		const mode = cm.getMode()
		console.log(mode)
	}
	onunload() {

	}
	editorChange(editor: Editor, info: MarkdownView | MarkdownFileInfo) {
		let dNum = 0
		let cNum = 0
		let eNum = 0
		let tNum = 0
		let vNum = 0
		for (const label of labels) {
			switch (label.type) {
				case 'd':
					dNum++;
					break;
				case 'e':
					eNum++;
					break;
				case 'v':
					vNum++;
					break;
				case 't':
					tNum++;
					break;
				case 'c':
					cNum++;
					break;
			}
		}
		let content =""
		if (dNum > 0){
			content += " 描述 "+dNum
		}
		if (eNum > 0){
			content += " 例子 "+eNum
		}
		if (tNum > 0){
			content += " 迁移 "+tNum
		}
		if (vNum > 0){
			content += " 验证 "+vNum
		}
		if (cNum > 0){
			content += " 其他 "+cNum
		}
		
		if (labelStatusBar){
			labelStatusBar.textContent = content
		}
	}
}

function MarkdownPostProcessor(element: HTMLElement, context: MarkdownPostProcessorContext): Promise<any> | void {
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
}

