import { EditorView, WidgetType } from "@codemirror/view";
import { Label } from "Label";
// todo: 编辑状态下的样式

let typeClass = new Map([
    ['d','mv-label-d'],
    ['e','mv-label-e'],
    ['v','mv-label-v'],
    ['t','mv-label-t'],
    ['c','mv-label-c'],
])
export class ModelvolLabelWidget extends WidgetType {
    
  label:Label
  constructor(label:Label){
    super();
    this.label = label
  }
  toDOM(view: EditorView): HTMLElement {
    let tag = document.createElement("span");

    tag.className = 'mv-label ' + typeClass.get(this.label.type);
    // tag.textContent = this.label.tagName.length > 2?this.label.tagName.substring(0,2):this.label.tagName;
    tag.textContent = this.label.tagName
    return tag
  }
}
export class ModevolLabelActiveWidget extends WidgetType{
  label:Label
  constructor(label:Label){
    super();
    this.label = label
  }
  toDOM(view: EditorView): HTMLElement {
    let tag = document.createElement("span");
    tag.className = 'mv-label-active ';
    if (this.label.type != "c"){
      tag.textContent = '#'+ this.label.type;
    }else{
      tag.textContent = '#c '+this.label.tagName;
    }
    return tag;
  }
}