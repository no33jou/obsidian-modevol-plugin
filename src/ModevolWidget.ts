import { EditorView, WidgetType } from "@codemirror/view";
import { MarkdownRenderChild } from "obsidian";
import { Label } from "./Label";
import { LabelConfig } from "./settings";
import { sanitizeSvg } from "./sanitizeSvg";

const typeClassMap = new Map<string, string>();
let iconMap: Record<string, string> = {};
let suffToClassMap: Record<string, string> = {};
let customTagSet = new Set<string>();
let labelConfigsMap: Map<string, LabelConfig> = new Map();

export function setLabelConfigs(configs: LabelConfig[]) {
  typeClassMap.clear();
  iconMap = {};
  suffToClassMap = {};
  customTagSet = new Set<string>();
  labelConfigsMap = new Map();
  configs.forEach(config => {
    if (!config.enabled) {
      return;
    }
    const key = config.key;
    typeClassMap.set(key, `mv-label-${key}`);
    const symbol = `#${key}`;
    iconMap[symbol] = config.svgIcon;
    suffToClassMap[symbol] = ` mv-${key}`;
    labelConfigsMap.set(key, config);
    if (config.custom) {
      customTagSet.add(symbol);
    }
  });
}

export function isKnownTagSymbol(symbol: string): boolean {
  return Object.prototype.hasOwnProperty.call(suffToClassMap, symbol);
}

export function isCustomTagSymbol(symbol: string): boolean {
  return customTagSet.has(symbol);
}

export function getLabelColor(key: string): string {
  const config = labelConfigsMap.get(key);
  return config?.color || '';
}

export class ModelvolLabelWidget extends WidgetType {

  label: Label
  constructor(label: Label) {
    super();
    this.label = label
  }
  toDOM(view: EditorView): HTMLElement {
    const tag = document.createElement("span");
    const mapped = typeClassMap.get(this.label.type);
    const className = mapped || "mv-label-" + this.label.type;
    tag.className = "mv-label " + className;
    tag.textContent = this.label.tagName;
    return tag;
  }
}
export class ModevolLabelActiveWidget extends WidgetType {
  label: Label
  constructor(label: Label) {
    super();
    this.label = label
  }
  toDOM(view: EditorView): HTMLElement {

    const symbol = "#" + this.label.type;
    const tagContent = isCustomTagSymbol(symbol)
      ? symbol + " " + this.label.tagName
      : symbol;
    const tag = document.createElement("div");
    tag.className = "mv-label-active ";
    tag.textContent = tagContent;
    if (this.label.color) {
        tag.style.color = this.label.color;
    }
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
    const el = document.createElement("div");
    el.textContent = this.label.content;
    return el;
  }

}

export class ModevolLabelRender extends MarkdownRenderChild {
  static CUSTOM_ICON = `<svg fill="none" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em"><text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" font-size="14" font-weight="500" fill="#CBC9CA">{{Name}}</text><g fill="#CBC9CA"><path d="m5.1 27.3c-0.17828-3.1727-0.13149-6.354 0.14-9.52 0.045696-0.79223 0.34353-1.5491 0.85-2.16 0.53936-0.50138 1.1962-0.85902 1.91-1.04 0.62166-0.20775 1.261-0.35838 1.91-0.45l0.15 0.58c-1.0708 0.43913-2.0232 1.1243-2.78 2-0.38141 0.99402-0.55169 2.0566-0.5 3.12 0 2.2 0 5.31-0.08 7.49l-1.6-0.02z"></path><ellipse cx="9.9801" cy="14.43" rx=".3" ry=".3"></ellipse><path d="m6.7 20.71c0.07 2.17 0.08 5.3 0.08 7.5 0.05 0.91 0.05 2.47 0.5 3.11 0.34615 0.4178 0.74633 0.7877 1.19 1.1 0.49937 0.3428 1.0321 0.6342 1.59 0.87l-0.15 0.58c-1.53-0.29-3.32-0.53-4.24-2-0.89-2.38-0.59-4.97-0.67-7.39 0-1.26 0.07-2.51 0.1-3.77h1.6z"></path><ellipse cx="9.9801" cy="33.58" rx=".3" ry=".3"></ellipse><path d="m41.3 27.3c-0.08-2.17-0.09-5.29-0.08-7.49-0.06-0.91-0.06-2.47-0.51-3.12-0.34362-0.42019-0.74414-0.79042-1.19-1.1-0.50057-0.34081-1.0331-0.63217-1.59-0.87l0.15-0.59c1.53 0.29 3.32 0.53 4.24 2 0.89 2.35 0.6 4.94 0.65 7.37 0 1.25-0.04999 2.5-0.06999 3.76l-1.6 0.04z"></path><ellipse cx="38.01" cy="14.43" rx=".3" ry=".3"></ellipse><path d="m42.9 20.71c0.17 3.173 0.11988 6.3539-0.15 9.52-0.04704 0.795-0.34459 1.5546-0.85 2.17-0.5339 0.4843-1.18 0.828-1.88 1-0.63217 0.2045-1.2814 0.3518-1.94 0.44l-0.15-0.58c1.0742-0.433 2.0279-1.1192 2.78-2 0.37929-0.99131 0.55282-2.0495 0.51-3.11 0-2.21 0-5.32 0.08-7.5l1.6 0.059998z"></path><ellipse cx="38.01" cy="33.58" rx=".3" ry=".3"></ellipse></g></svg>`;
  nextNode: Node;
  text: string;
  nextEl: Element | null;
  color: string;
  constructor(containerEl: HTMLElement, nextNode: ChildNode, nextEl: Element | null, color: string = '') {
    super(containerEl);

    this.nextNode = nextNode;
    this.nextEl = nextEl
    this.color = color
  }

  onload() {
    this.patchNextNode()

    const tag = this.containerEl.textContent
    if (tag && isCustomTagSymbol(tag)) {
      this.customLabel()
      return
    }
    this.normalLabel()
  }
  patchNextNode() {
    if (!this.nextNode.nodeValue) {
      return
    }
    let nodeList = this.nextNode.nodeValue.split('\n')
    nodeList = nodeList.filter(value => { return value != '' })
    const titleContent = nodeList.first()
    if (titleContent == undefined) {
      return
    }
    nodeList.remove(titleContent)
    this.text = titleContent

    if (this.nextEl && this.nextEl.tagName == 'BR') {
      this.nextEl.parentElement?.removeChild(this.nextEl)
    }

    if (nodeList.length == 0 && this.containerEl.parentElement) {
      this.containerEl.parentElement.removeChild(this.nextNode)
      return
    }

    this.nextNode.nodeValue = nodeList.join('\n') + '\n'

  }
  normalLabel() {
    if (!this.containerEl.textContent) return
    const dom = document.createElement("span");
    let className = 'mv-pre-label'
    const classExt = suffToClassMap[this.containerEl.textContent] || '';
    className = className + classExt;
    dom.className = className

    const icon = document.createElement('div')
    icon.className = 'mv-pre-icon'
    const title = document.createElement("span");
    title.className = 'mv-pre-title';

    const iconSvg = iconMap[this.containerEl.textContent] || '';
    const sanitized = sanitizeSvg(iconSvg);
    if (sanitized) {
      icon.innerHTML = sanitized;
    }
    title.textContent = this.text

    dom.appendChild(icon);
    dom.appendChild(title)

    this.containerEl.replaceWith(dom)
  }
  customLabel() {
    const list = this.text.trim().split(/\s+/)
    if (!list || list?.length < 2) {
      return
    }

    const name = list.first()
    const title = list[1]
    if (name == undefined) return
    const tagIcon = ModevolLabelRender.CUSTOM_ICON.replace('{{Name}}', name)
    const sanitized = sanitizeSvg(tagIcon);


    const dom = document.createElement("span");
    dom.className = 'mv-pre-label mv-c'
    if (this.color) {
        dom.style.color = this.color;
    }
    const iconEl = document.createElement('div')
    iconEl.className = 'mv-pre-icon mv-pre-c'
    if (sanitized) {
      iconEl.innerHTML = sanitized;
    }
    const titleEl = document.createElement("span");
    titleEl.className = 'mv-pre-title';
    titleEl.textContent = title
    dom.appendChild(iconEl);
    dom.appendChild(titleEl)

    this.containerEl.replaceWith(dom)
  }
}
