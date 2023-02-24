
export class Label {
    // 类型
    type: string;
    // 标签文本
    tagName: string;
    // 原文
    text: string;
    // 需要显示的内容
    content: string;
    // 标题
    title:string | undefined;
    /* 关联 */
    relation: string | undefined;

    constructor() {
    }
}
