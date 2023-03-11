import * as CodeMirror from 'codemirror';
import { App, debounce, Editor, MarkdownFileInfo, MarkdownPostProcessorContext, MarkdownView, Plugin, WorkspaceLeaf } from 'obsidian';
import { labelField } from 'src/StateField';
import { ModevolLabelRender } from './ModevolWidget';
import { OutlineView, VIEW_TYPE } from './OutlineView';
import { store } from './store';
let labelStatusBar:HTMLElement| null = null
interface SourceViewP{
	editor:CodeMirror.Editor
}
export default class ModevolPlugin extends Plugin {
	markdownView:MarkdownView
	async onload() {
		
		this.initStore()
		this.registerV()
		this.registerListenter()
		this.registerExt()
		this.registerCommend()
	}
	
	onunload() {
		
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
	}
	initStore(){
		// store.plugin = this
		store.labels = []
		store.headings = []
	}
	registerV(){
		const item = this.addStatusBarItem()
		labelStatusBar = item.createSpan({text:'Modevol'});

		this.registerView(VIEW_TYPE,(leaf: WorkspaceLeaf) => new OutlineView(leaf, this))
	}
	registerListenter(){
		this.registerEvent(this.app.workspace.on('editor-change', debounce(this.editorChange,300)))
		this.registerEvent(this.app.workspace.on('layout-change',()=>{
			const file = this.app.workspace.getActiveFile()
			if (!file) return
			const cache = this.app.metadataCache.getFileCache(file)
			if (!cache)return
			const headers = cache.headings
			store.headings = headers?headers:[]
		}))

		this.registerEvent(this.app.workspace.on('active-leaf-change',()=>{
			let view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view) {
				// 保证第一次获取标题信息时，也能正常展开到默认层级
				if (!this.markdownView) {
					this.markdownView = view;
					return;
				}
				if (view == this.markdownView){
					return
				}
				this.markdownView = view;
			}
		}))
	}
	registerExt(){
		this.registerEditorExtension([labelField])
		this.registerMarkdownPostProcessor(MarkdownPostProcessor)
	}
	registerCommend(){
		this.addCommand({
			id: "modevol-outline",
			name: "Modevol Outline",
			callback: () => {
				this.activateView();
			}
		});

	}
	editorChange(editor: Editor, info: MarkdownView | MarkdownFileInfo) {
		let dNum = 0
		let cNum = 0
		let eNum = 0
		let tNum = 0
		let vNum = 0
		for (const label of store.labels) {
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
	async activateView() {
		if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length === 0) {
			await this.app.workspace.getRightLeaf(false).setViewState({
				type: VIEW_TYPE,
				active: true,
			});
		}
		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
		);
	}

}

function MarkdownPostProcessor(element: HTMLElement, context: MarkdownPostProcessorContext): Promise<any> | void {
	const tags = element.querySelectorAll('.tag')
	for (let index = 0; index < tags.length; index++) {
		const tag = tags.item(index)
		let pr = tag.previousSibling
		let nextNode = tag.nextSibling
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

