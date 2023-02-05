import {
  Decoration,
  DecorationSet,
  EditorView,
  PluginSpec,
  PluginValue,
  ViewPlugin,
  ViewUpdate,
  MatchDecorator,
} from "@codemirror/view";
import ExpressionInterpreter from "ExpressionInterpreter";
import { ModelvolLabelWidget, ModevolLabelActiveWidget } from "ModevolWidget";
import { editorLivePreviewField } from "obsidian";
let interpreter = new ExpressionInterpreter()
let match = new MatchDecorator({
  regexp: ExpressionInterpreter.tag_reg,
  decoration: (match: RegExpExecArray, view: EditorView, pos: number) => {
    const cursor = view.state.selection.main.head;
    let text = match[0]
    let label = interpreter.getLabel(match)
    if (label == undefined){
      return null
    }
    let from = pos
    // let to = label.type == 'c'?pos+3+label.tagName.length:pos+3;
    let to = pos+100;
    console.log(to,'  ',from)
    // if (cursor > pos - 1 && cursor < pos + match[0].length + 1) {
    //   return Decoration.replace({
    //     from:pos,
    //     to:to,
    //     widget: new ModevolLabelActiveWidget(label),
    //   });
    // }
    
    return Decoration.replace({
        from:pos,
        to:to,
        widget: new ModelvolLabelWidget(label),
      });
  },
});

export class LabelViewPlugin implements PluginValue {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = match.createDeco(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.focusChanged) {
      this.decorations = match.updateDeco(update,this.decorations)
    }
  }

  destroy() {
    
  }
}
const pluginSpec: PluginSpec<LabelViewPlugin> = {
  decorations: (value: LabelViewPlugin) => value.decorations,
  provide(plugin) {
      return EditorView.atomicRanges.of(view => {
        return view.plugin(plugin)?.decorations || Decoration.none
      })
  },
};
export const viewPlugin = ViewPlugin.fromClass(LabelViewPlugin,pluginSpec);
