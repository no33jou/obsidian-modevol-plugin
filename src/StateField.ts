import {
  Extension,
  RangeSetBuilder,
  StateField,
  Transaction,
  StateEffect,
  Text,
  EditorSelection
} from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
} from "@codemirror/view";
import ExpressionInterpreter from "src/ExpressionInterpreter";
import { Label } from "./Label";
import { ModelvolLabelWidget, ModevolLabelActiveWidget, ModevolTitleActiveWidget } from "src/ModevolWidget";



let interpreter = new ExpressionInterpreter()
export var labels:Label[] = []

function getDecoration(doc: Text, selection?: EditorSelection) {
  const builder = new RangeSetBuilder<Decoration>();
  var list:Label[] = []
  let pos = 0;
  let select = selection?.main
  let selectFrom = select ? select.from : 0
  let selectTo = select ? select.from : 0
  for (let line of doc.toJSON()) {
    let regMatchL = ExpressionInterpreter.tag_reg.exec(line)
    if (regMatchL == null) {
      pos += line.length + 1;
      continue;
    }
    let label = interpreter.getLabel(regMatchL)
    if (label == undefined) {
      pos += line.length + 1
      continue
    }
    list.push(label)
    let from = pos
    let to = label.type == 'c' ? from + 3 + label.tagName.length : from + 2
    let isSelect = selectFrom > pos - 1 && selectTo < pos + line.length + 1;
    if (label.type == 'c' && isSelect) {
      let tagMark = Decoration.mark({class:' mv-label-active'})
      // let tagReplace = Decoration.replace({
      //   widget: new ModevolLabelActiveWidget(label),
      // })
      builder.add(from, to, tagMark)
      // let contentRe = Decoration.replace({
      //   widget:new ModevolTitleActiveWidget(label)
      // })
      // builder.add(to,pos + line.length,contentRe)
      pos += line.length + 1
      continue
    }

    let replace = Decoration.replace({
      widget: new ModelvolLabelWidget(label),
    })

    builder.add(from, to, replace)

    pos += line.length + 1
  }
  labels = list
  return builder.finish();
}
export const labelField = StateField.define<DecorationSet>({
  create(state: { doc: any; }): DecorationSet {
    return getDecoration(state.doc);
  },
  update(oldState: DecorationSet, transaction: Transaction): DecorationSet {

    if (!transaction.docChanged && !transaction.newSelection) {
      return oldState;
    }
    return getDecoration(transaction.state.doc, transaction.newSelection)
  },
  provide(field: StateField<DecorationSet>): Extension {
    return EditorView.decorations.from(field);
  },
});
