import { Label } from "Label";
import { text } from "stream/consumers";
// modevol 解释器

// todo: 先做效果，做改匹配规则
export default class ExpressionInterpreter {
    static tag_reg = /^#([devtc])(?=\s)(.*|$)/
    getLabel(regArray: RegExpExecArray): Label | undefined {
        let tag = regArray[1].toLowerCase()
        switch (tag) {
            case 'd':
            case 'e':
            case 'v':
            case 't':
                return normalInterpter(regArray)
                break;
            case 'c':
                return customInterpret(regArray)
                break
            default:
        }
        return undefined
    }

}
function normalInterpter(regArray: RegExpExecArray) {
    let tag = regArray[1].toLowerCase()
    let label = new Label()
    switch (tag) {
        case 'd':
            label.type = "d"
            label.tagName = "描述"
            break
        case 'e':
            label.type = "e"
            label.tagName = "例子"
            break
        case 'v':
            label.type = "v"
            label.tagName = "验证"
            break
        case 't':
            label.type = "t"
            label.tagName = "迁移"
            break
        default:
            return undefined;
    }
    label.text = regArray[0];
    label.content = label.text.substring(2)
    let list = label.content.trim().split(' ')
    label.title = list.length > 0 ? list[0] : ''
    label.relation = list.length > 1 ? list[1] : ''
    return label
}
function customInterpret(regArray: RegExpExecArray) {
    let label = new Label()
    label.text = regArray[0]
    label.type = 'c';

    let list = label.text.substring(2).trim().split(' ')
    if(list.length <0 || list[0].length == 0)return undefined
    label.tagName = list.length > 0 ? list[0] : ""
    label.title = list.length > 1 ? list[1] : ''
    label.relation = list.length > 2 ? list[2] : ''
    label.content = label.text.substring(3 + label.tagName.length)
    return label
}