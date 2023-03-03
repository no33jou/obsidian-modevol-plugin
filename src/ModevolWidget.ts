import { EditorView, WidgetType } from "@codemirror/view";
import { MarkdownRenderChild } from "obsidian";
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

export class ModevolLabelRender extends MarkdownRenderChild {
  static ALL_ICON :Record<string, string> = {
    "#e": `<svg fill="none" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1.4823529411764704em" height="1.4823529411764704em"><g><rect x="25.427" y="25.723" width="15.27" height="10.04" rx="2.83" fill="none" fill-opacity="0" stroke="#CD5255" stroke-width="3"></rect><rect x="16.526" y="13.009" width="15.27" height="10.174" rx="2.83" fill="none" fill-opacity="0" stroke="#CD5255" stroke-width="3"></rect><rect x="7.6262" y="25.723" width="15.27" height="10.04" rx="2.83" fill="none" fill-opacity="0" stroke="#CD5255" stroke-width="3"></rect><line x1="20.887" x2="27.445" y1="24.631" y2="24.631" fill="none" fill-opacity="0" stroke="#CD5255" stroke-width="5"></line></g></svg>`,
    "#d": `<svg fill="none" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1.4823529411764704em" height="1.4823529411764704em"><g><path d="m13.907 31.859c2.6916 0 3.6785-1.7081 4.6923-5.4763 0.43962-1.6598 1.3638-5.114 2.0995-5.3832 0.71776 0.24224 1.6329 1.8157 2.0815 3.5024 1.0048 3.7861 1.9558 5.5723 4.6923 5.5723 2.7364 0 3.6785-3.5888 4.6833-7.357 0.4486-1.6598 1.3638-3.3294 2.0995-3.5985 0.7433 0 1.3458-0.60253 1.3458-1.3458 0-0.74326-0.6025-1.3458-1.3458-1.3458-2.6916 0-3.6785 1.8041-4.6833 5.5723-0.4486 1.6598-1.3638 5.114-2.0995 5.3832-0.7178-0.2422-1.6419-1.9118-2.0815-3.5985-1.0138-3.7862-1.9649-5.4763-4.6923-5.4763-2.7275 0-3.6875 3.5888-4.6924 7.357-0.4486 1.6598-1.3637 3.2333-2.0994 3.5025-0.74326 0-1.3458 0.6025-1.3458 1.3458 0 0.7432 0.60253 1.3458 1.3458 1.3458z" fill="#4B99D3"></path><rect x="7.6262" y="30.523" width="10.165" height="10.165" rx="2.83" fill="none" fill-opacity="0" stroke="#4B99D3" stroke-width="3"></rect><rect x="30.514" y="7.6262" width="10.183" height="10.183" rx="5.0916" fill="none" fill-opacity="0" stroke="#4B99D3" stroke-width="3"></rect></g></svg>`,
    "#t": `<svg fill="none" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1.4823529411764704em" height="1.4823529411764704em"><g><path d="m25.933 42.031q-3.6669 0-7.0182-1.4169-3.2359-1.3682-5.7312-3.8621-2.4952-2.4939-3.8651-5.7291-1.4187-3.3505-1.4207-7.0174 0-3.6691 1.4179-7.0215 1.3691-3.2368 3.8645-5.7323 2.4954-2.4954 5.7323-3.8645 3.3523-1.4179 7.0206-1.4179 3.0008-0.00524 5.8419 0.96865 2.8412 0.97389 5.2098 2.8206l-1.8446 2.3659q-4.0584-3.1641-9.2071-3.1551-3.0599 0-5.8519 1.1809-2.698 1.1411-4.7797 3.2228-2.0817 2.0817-3.2228 4.7796-1.1809 2.792-1.1809 5.8511 0.00166 3.0588 1.1833 5.8494 1.1418 2.6966 3.2233 4.7769 2.0815 2.0804 4.7787 3.2208 2.7912 1.1801 5.85 1.1801v3zm1.5-1.5q0 0.0737-0.0072 0.147-0.0072 0.0734-0.0216 0.1456-0.0144 0.0723-0.0358 0.1428t-0.0496 0.1386-0.0629 0.1331-0.0757 0.1263q-0.0409 0.0612-0.0877 0.1182-0.0467 0.057-0.0988 0.1091t-0.1091 0.0988q-0.0569 0.0468-0.1182 0.0877t-0.1263 0.0757q-0.065 0.0347-0.1331 0.0629-0.068 0.0282-0.1385 0.0496-0.0706 0.0214-0.1428 0.0358-0.0723 0.0144-0.1456 0.0216-0.0734 0.0072-0.1471 0.0072t-0.147-0.0072-0.1456-0.0216-0.1428-0.0358-0.1386-0.0496-0.1331-0.0629q-0.065-0.0348-0.1262-0.0757-0.0613-0.0409-0.1183-0.0877-0.0569-0.0467-0.109-0.0988t-0.0989-0.1091q-0.0467-0.057-0.0877-0.1182-0.0409-0.0613-0.0757-0.1263-0.0347-0.065-0.0629-0.1331-0.0282-0.0681-0.0496-0.1386-0.0214-0.0705-0.0358-0.1428-0.0143-0.0722-0.0216-0.1456-0.0072-0.0733-0.0072-0.147t0.0072-0.147q0.0073-0.0734 0.0216-0.1456 0.0144-0.0723 0.0358-0.1428 0.0214-0.0705 0.0496-0.1386 0.0282-0.0681 0.0629-0.1331 0.0348-0.065 0.0757-0.1263 0.041-0.0612 0.0877-0.1182 0.0468-0.0569 0.0989-0.1091 0.0521-0.0521 0.109-0.0988 0.057-0.0468 0.1183-0.0877 0.0612-0.0409 0.1262-0.0757 0.065-0.0347 0.1331-0.0629t0.1386-0.0496 0.1428-0.0358 0.1456-0.0216 0.147-0.0072 0.1471 0.0072q0.0733 0.0073 0.1456 0.0216 0.0722 0.0144 0.1428 0.0358 0.0705 0.0214 0.1385 0.0496 0.0681 0.0282 0.1331 0.0629 0.065 0.0348 0.1263 0.0757 0.0613 0.0409 0.1182 0.0877 0.057 0.0467 0.1091 0.0988 0.0521 0.0522 0.0988 0.1091 0.0468 0.057 0.0877 0.1182 0.041 0.0613 0.0757 0.1263t0.0629 0.1331 0.0496 0.1386 0.0358 0.1428q0.0144 0.0722 0.0216 0.1456 0.0072 0.0733 0.0072 0.147zm10.129-29.59q0 0.07369-0.0073 0.14703-0.0072 0.07334-0.0216 0.14561-0.0143 0.07227-0.0357 0.14279t-0.0496 0.1386q-0.0282 0.06808-0.0629 0.13307-0.0348 0.06499-0.0757 0.12626-0.041 0.06127-0.0877 0.11823-0.0468 0.05697-0.0989 0.10907-0.0521 0.05211-0.109 0.09886-0.057 0.04675-0.1183 0.08769-0.0612 0.04094-0.1262 0.07568-0.065 0.03473-0.1331 0.06293-0.0681 0.0282-0.1386 0.04959-0.0705 0.0214-0.1428 0.03577-0.0723 0.01438-0.1456 0.0216-0.0733 0.00722-0.147 0.00722-0.0737 0-0.1471-0.00722-0.0733-0.00722-0.1456-0.0216-0.0722-0.01437-0.1428-0.03577-0.0705-0.02139-0.1386-0.04959-0.068-0.0282-0.133-0.06293-0.065-0.03474-0.1263-0.07568-0.0613-0.04094-0.1182-0.08769-0.057-0.04675-0.1091-0.09886-0.0521-0.0521-0.0988-0.10907-0.0468-0.05696-0.0877-0.11823-0.041-0.06127-0.0757-0.12626-0.0347-0.06499-0.063-0.13307-0.0281-0.06808-0.0495-0.1386t-0.0358-0.14279q-0.0144-0.07227-0.0216-0.14561-0.0072-0.07334-0.0072-0.14703t0.0072-0.14702q0.0072-0.07334 0.0216-0.14561 0.0144-0.07228 0.0358-0.14279 0.0214-0.07052 0.0495-0.1386 0.0283-0.06808 0.063-0.13307 0.0347-0.06499 0.0757-0.12626 0.0409-0.06127 0.0877-0.11824 0.0467-0.05696 0.0988-0.10907 0.0521-0.0521 0.1091-0.09885 0.0569-0.04675 0.1182-0.08769 0.0613-0.04094 0.1263-0.07568t0.133-0.06294q0.0681-0.0282 0.1386-0.04959 0.0706-0.02139 0.1428-0.03576 0.0723-0.01438 0.1456-0.0216 0.0734-0.00723 0.1471-0.00723 0.0737 0 0.147 0.00723 0.0733 0.00722 0.1456 0.0216 0.0723 0.01437 0.1428 0.03576 0.0705 0.02139 0.1386 0.04959 0.0681 0.0282 0.1331 0.06294 0.065 0.03474 0.1262 0.07568 0.0613 0.04094 0.1183 0.08769 0.0569 0.04675 0.109 0.09885 0.0521 0.05211 0.0989 0.10907 0.0467 0.05697 0.0877 0.11824 0.0409 0.06127 0.0757 0.12626 0.0347 0.06499 0.0629 0.13307t0.0496 0.1386q0.0214 0.07051 0.0357 0.14279 0.0144 0.07227 0.0216 0.14561 0.0073 0.07333 0.0073 0.14702z" fill="#EBAB37"></path><path d="m38.019 7.4153 1.929 7.8146-7.7338-2.234 5.8049-5.5806z" fill="#EBAB37"></path><path d="m17.024 30.437c2.4942 0 3.3914-3.0774 4.2617-6.0561 0.3858-1.3458 1.1215-3.858 1.7047-4.1181 0.5114 0.26019 1.2471 2.7723 1.6419 4.1181 0.8972 2.9787 1.7944 6.0561 4.2617 6.0561s3.3825-3.0774 4.2796-6.0561c0.3858-1.3458 1.1215-3.858 1.7047-4.1181 0.7404 7e-5 1.3379-0.60545 1.3279-1.3458-0.0098-0.74609-0.6175-1.3458-1.3638-1.3458-2.4942 0-3.3914 3.0864-4.2527 6.0561-0.3947 1.3548-1.1304 3.8669-1.7136 4.1271-0.5114-0.26021-1.2471-2.7724-1.6419-4.1271-0.8972-2.9697-1.7944-6.0561-4.2617-6.0561-2.4673 0-3.3914 3.0864-4.2527 6.0561-0.39477 1.3548-1.1305 3.8669-1.7136 4.1271-0.74041-1e-4 -1.3378 0.6054-1.3278 1.3458 0.0097559 0.7377 0.60803 1.332 1.3458 1.3368z" fill="#EBAB37"></path></g></svg>`,
    "#v": `<svg fill="none" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1.4823529411764704em" height="1.4823529411764704em"><path d="m24.254 24.312c0.91016-0.79687 1.5781-1.4102 1.793-1.6523 0.52344-0.69922 0.78906-1.5781 0.78906-2.6172 0-1.293-0.42968-2.3242-1.2812-3.0703-0.83203-0.74609-1.957-1.125-3.3477-1.125-1.5469 0-2.793 0.44922-3.7031 1.3359-0.92968 0.88672-1.3828 2.0938-1.3828 3.6875v0.13281h2.6172v-0.13281c0-0.85156 0.16406-1.5039 0.49219-1.9492 0.35937-0.53125 0.95703-0.78906 1.8281-0.78906 0.67578 0 1.1992 0.17968 1.5547 0.53515 0.35937 0.37891 0.54297 0.89063 0.54297 1.5195 0 0.48828-0.17578 0.95313-0.52344 1.3789l-0.23438 0.27734c-1.3711 1.2266-2.1719 2.0977-2.4453 2.6602-0.28906 0.55469-0.42578 1.2344-0.42578 2.0821v0.4219h2.6367v-0.4219c0-0.4649 0.09765-0.88283 0.29687-1.2813 0.19141-0.38672 0.45704-0.71875 0.79297-0.99219zm-2.418 3.4375c-0.48828 0-0.88671 0.1524-1.2266 0.4688-0.32812 0.3086-0.49609 0.7148-0.49609 1.2109 0 0.4961 0.16797 0.9024 0.49609 1.211 0.34766 0.3242 0.76172 0.4882 1.2266 0.4882 0.48438 0 0.88672-0.1523 1.2266-0.4687 0.33984-0.3164 0.51562-0.7422 0.51562-1.2305 0-0.4726-0.16406-0.8789-0.49609-1.2109-0.33594-0.3086-0.75391-0.4688-1.2461-0.4688z" fill="#7468D4"></path><path d="m38.991 37.397-4.5263-4.5224c2.3399-2.7773 3.75-6.3554 3.75-10.262 0-8.7968-7.1562-15.953-15.953-15.953-5.4492 0-10.469 2.7383-13.422 7.3281-0.11719 0.1836-0.23047 0.36719-0.33985 0.55469-0.30859 0.52734-0.59375 1.0781-0.83984 1.6406-0.33594 0.75776 0.007813 1.6485 0.76953 1.9805 0.75781 0.3359 1.6484-0.0078 1.9805-0.7695 0.19922-0.4532 0.42969-0.90237 0.67969-1.3282 0.08984-0.15235 0.17968-0.30078 0.27734-0.44922 2.4023-3.7266 6.4766-5.9531 10.898-5.9531 7.1367 0 12.945 5.8086 12.945 12.949 0 7.1367-5.8086 12.945-12.945 12.945-5.6992 0-10.805-3.8125-12.418-9.2734-0.23438-0.7969-1.0703-1.25-1.8672-1.0156-0.79687 0.2343-1.25 1.0703-1.0156 1.8672 1.9883 6.7304 8.2773 11.43 15.301 11.43 3.8086 0 7.3125-1.3437 10.059-3.582l4.542 4.5419c0.2929 0.293 0.6797 0.4415 1.0625 0.4415 0.3867 0 0.7695-0.1485 1.0624-0.4415 0.586-0.5898 0.586-1.539 0-2.1289z" fill="#7468D4"></path></svg>`,
  };
  static CUSTOM_ICON = `<svg fill="none" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="2.1176470588235294em" height="2.1176470588235294em"><text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" font-size="14" font-weight="500" fill="#CBC9CA">{{Name}}</text><g fill="#CBC9CA"><path d="m5.1 27.3c-0.17828-3.1727-0.13149-6.354 0.14-9.52 0.045696-0.79223 0.34353-1.5491 0.85-2.16 0.53936-0.50138 1.1962-0.85902 1.91-1.04 0.62166-0.20775 1.261-0.35838 1.91-0.45l0.15 0.58c-1.0708 0.43913-2.0232 1.1243-2.78 2-0.38141 0.99402-0.55169 2.0566-0.5 3.12 0 2.2 0 5.31-0.08 7.49l-1.6-0.02z"></path><ellipse cx="9.9801" cy="14.43" rx=".3" ry=".3"></ellipse><path d="m6.7 20.71c0.07 2.17 0.08 5.3 0.08 7.5 0.05 0.91 0.05 2.47 0.5 3.11 0.34615 0.4178 0.74633 0.7877 1.19 1.1 0.49937 0.3428 1.0321 0.6342 1.59 0.87l-0.15 0.58c-1.53-0.29-3.32-0.53-4.24-2-0.89-2.38-0.59-4.97-0.67-7.39 0-1.26 0.07-2.51 0.1-3.77h1.6z"></path><ellipse cx="9.9801" cy="33.58" rx=".3" ry=".3"></ellipse><path d="m41.3 27.3c-0.08-2.17-0.09-5.29-0.08-7.49-0.06-0.91-0.06-2.47-0.51-3.12-0.34362-0.42019-0.74414-0.79042-1.19-1.1-0.50057-0.34081-1.0331-0.63217-1.59-0.87l0.15-0.59c1.53 0.29 3.32 0.53 4.24 2 0.89 2.35 0.6 4.94 0.65 7.37 0 1.25-0.04999 2.5-0.06999 3.76l-1.6 0.04z"></path><ellipse cx="38.01" cy="14.43" rx=".3" ry=".3"></ellipse><path d="m42.9 20.71c0.17 3.173 0.11988 6.3539-0.15 9.52-0.04704 0.795-0.34459 1.5546-0.85 2.17-0.5339 0.4843-1.18 0.828-1.88 1-0.63217 0.2045-1.2814 0.3518-1.94 0.44l-0.15-0.58c1.0742-0.433 2.0279-1.1192 2.78-2 0.37929-0.99131 0.55282-2.0495 0.51-3.11 0-2.21 0-5.32 0.08-7.5l1.6 0.059998z"></path><ellipse cx="38.01" cy="33.58" rx=".3" ry=".3"></ellipse></g></svg>`
  nextNode: Node;
  text:string;
  nextEl:Element|null;
  constructor(containerEl: HTMLElement, nextNode: ChildNode, nextEl:Element|null) {
    super(containerEl);

    this.nextNode = nextNode;
    this.nextEl = nextEl
  }

  onload() {
    this.patchNextNode()
    
    const tag = this.containerEl.textContent
    if(tag == '#c'){
      this.customLabel()
      return
    }
    this.normalLabel()
  }
  patchNextNode(){
    if (!this.nextNode.nodeValue) return
    let nodeList = this.nextNode.nodeValue.split('\n')
    nodeList = nodeList.filter(value=>{return value != ''})
    let titleContent = nodeList.first()
    if (titleContent == undefined) return
    nodeList.remove(titleContent)
    this.text = titleContent

    if (this.nextEl && this.nextEl.tagName == 'BR'){
      this.nextEl.parentElement?.removeChild(this.nextEl)
    }

    if(nodeList.length == 0 && this.containerEl.parentElement){
      this.containerEl.parentElement.removeChild(this.nextNode)
      return
    }
    
    this.nextNode.nodeValue = nodeList.join('\n')+'\n'
    
  }
  normalLabel(){
    const dom = document.createElement("span");
    dom.className = 'mv-pre-label'
    const icon = document.createElement('div')
    icon.className = 'mv-pre-icon'
    const title = document.createElement("span");
    title.className = 'mv-pre-title';

    if (!this.containerEl.textContent)return
    icon.innerHTML = ModevolLabelRender.ALL_ICON[this.containerEl.textContent]
		title.textContent = this.text

		dom.appendChild(icon);
    dom.appendChild(title)
    
    this.containerEl.replaceWith(dom)
  }
  customLabel(){
    const list = this.text.trim().split(/\s+/)
    if (!list || list?.length < 2){
      return
    }
    
    let name = list.first()
    const title = list[1]
    if (name == undefined )return 
    const tagIcon = ModevolLabelRender.CUSTOM_ICON.replace('{{Name}}', name)


    const dom = document.createElement("span");
    dom.className = 'mv-pre-label'
    const iconEl = document.createElement('div')
    iconEl.className = 'mv-pre-icon mv-pre-c'
    iconEl.innerHTML = tagIcon
    const titleEl = document.createElement("span");
    titleEl.className = 'mv-pre-title';
    titleEl.textContent = title
		dom.appendChild(iconEl);
    dom.appendChild(titleEl)
    
    this.containerEl.replaceWith(dom)
  }
}