import { EditorView, WidgetType } from "@codemirror/view";
import { Label } from "./Label";
// todo: 编辑状态下的样式

let typeClass = new Map([
  ['d', 'mv-label-d'],
  ['e', 'mv-label-e'],
  ['v', 'mv-label-v'],
  ['t', 'mv-label-t'],
  ['c', 'mv-label-c'],
])
export class ModelvolLabelWidget extends WidgetType {

  label: Label
  constructor(label: Label) {
    super();
    this.label = label
  }
  toDOM(view: EditorView): HTMLElement {
    let tag = document.createElement("span");

    tag.className = 'mv-label ' + typeClass.get(this.label.type);
    tag.textContent = this.label.tagName
    return tag
  }
}
export class ModevolLabelActiveWidget extends WidgetType {
  label: Label
  constructor(label: Label) {
    super();
    this.label = label
  }
  toDOM(view: EditorView): HTMLElement {

    let tagContent = ''
    if (this.label.type != "c") {
      tagContent = '#' + this.label.type;
    } else {
      tagContent = '#c ' + this.label.tagName;
    }
    let tag = document.createElement('div');
    tag.className = 'mv-label-active ';
    tag.textContent = tagContent
    return tag;
  }
}
export class ModevolTitleActiveWidget extends WidgetType {
  label: Label
  constructor(label: Label) {
    super();
    this.label = label
  }
  toDOM(view: EditorView): HTMLElement {
    let el = document.createElement('div')
    el.textContent = this.label.content
    return el 
  }

}