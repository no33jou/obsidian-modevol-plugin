import { syntaxTree } from "@codemirror/language";
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
import ExpressionInterpreter from "ExpressionInterpreter";
import { ModelvolLabelWidget, ModevolLabelActiveWidget } from "ModevolWidget";



let interpreter = new ExpressionInterpreter()

function getDecoration(doc: Text, selection?: EditorSelection) {
  const builder = new RangeSetBuilder<Decoration>();
  let pos = 0;
  let select = selection?.main
  let selectFrom = select ? select.from : 0
  let selectTo = select ? select.from : 0
  console.log(select)
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
    let from = pos
    let to = label.type == 'c' ? from + 3 + label.tagName.length : from + 2
    if (selectFrom > pos - 1 && selectTo < pos + line.length + 1) {
      pos += line.length + 1
      continue
    }
    let replace = Decoration.replace({
      widget: new ModelvolLabelWidget(label),
    })

    
    builder.add(from, to, replace)

    pos += line.length + 1
  }
  return builder.finish();
}
export const labelField = StateField.define<DecorationSet>({
  create(state): DecorationSet {
    return getDecoration(state.doc);
  },
  update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
    if (!transaction.docChanged || !transaction.newSelection) {
      return oldState;
    }
    return getDecoration(transaction.state.doc, transaction.newSelection)
  },
  provide(field: StateField<DecorationSet>): Extension {
    return EditorView.decorations.from(field);
  },
});


// export const statisticsField = StateField.define<Label>({
//     create(state): DecorationSet {
//         console.log(state);
//         return Decoration.none;
//       },
// })