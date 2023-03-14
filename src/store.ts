import { HeadingCache, TFile } from 'obsidian'
import { Label } from './Label'
import { reactive } from 'vue'


export const store = reactive({
	/** 文件base name 
		 * @type {string} */
	fileName:'',
	/** 标注 
		 * @type {Label[]} */
	labels: [] as Label[],
	/** 标题 
		 * @type {HeadingCache[]} */
	headings: [] as HeadingCache[],
	/** 是否暗黑主题 
		 * @type {boolean} */
	darkTheme: false
})
