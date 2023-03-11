import { HeadingCache, TFile } from 'obsidian'
import { Label } from './Label'
import { reactive } from 'vue'
import ModevolPlugin from './main'


export const store = reactive({
	/** 标注 
		 * @type {Label[]} */
	labels: [] as Label[],
	/** 标题 
		 * @type {HeadingCache[]} */
	headings: [] as HeadingCache[],
	/** 插件 
		 * @type {ModevolPlugin|undefined} */
	// plugin: undefined as ModevolPlugin | undefined,
})
