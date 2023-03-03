import * as CodeMirror from 'codemirror';
import { Editor, MarkdownEditView, MarkdownFileInfo, MarkdownPostProcessorContext, MarkdownRenderer, MarkdownSourceView, MarkdownView, Plugin } from 'obsidian';
import { Interface } from 'readline';
import { labelField, labels } from 'src/StateField';
import { ModevolLabelRender } from './ModevolWidget';
let labelStatusBar:HTMLElement| null = null
interface SourceViewP{
	editor:CodeMirror.Editor
}
export default class ModevolPlugin extends Plugin {


	async onload() {
		// 添加底部状态栏 
		const item = this.addStatusBarItem()
		labelStatusBar = item.createSpan({text:'Modevol'});

		this.registerEvent(this.app.workspace.on('editor-change', this.editorChange))
		this.registerEditorExtension([labelField])
		this.registerMarkdownPostProcessor(MarkdownPostProcessor)
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
		let nextNode = tag.nextSibling
		console.log(pr?.nodeValue)
		if (pr && !pr.nodeValue?.endsWith('\n')) {
			continue
		}
		if(!nextNode) return
		
		switch (tag.textContent) {
			case '#d':
			case '#e':
			case '#v':
			case '#t':
			case '#c':
				let render = new ModevolLabelRender(tag as HTMLElement,nextNode,tag.nextElementSibling)
				context.addChild(render)
				break;
			default:
				break;
		}
	}
}

