import {
  Extension,
  RangeSetBuilder,
  StateField,
  Transaction,
  Text,
  EditorSelection,
  EditorState,
} from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
} from "@codemirror/view";
import ExpressionInterpreter from "src/ExpressionInterpreter";
import { Label } from "./Label";
import { ModelvolLabelWidget } from "src/ModevolWidget";
import { store } from "./store";
import { LabelConfig } from "./settings";

let interpreter: ExpressionInterpreter | null = null;

export function setLabelConfigs(configs: LabelConfig[]) {
  interpreter = new ExpressionInterpreter(configs);
}

export function __getInterpreterForTest(): ExpressionInterpreter | null {
  return interpreter;
}

function getDecoration(doc: Text, selection?: EditorSelection) {
  const builder = new RangeSetBuilder<Decoration>();
  if (!interpreter) {
    interpreter = new ExpressionInterpreter([]);
  }
  const list: Label[] = [];
  let pos = 0;
  const select = selection?.main;
  const selectFrom = select ? select.from : 0;
  const selectTo = select ? select.to : 0;
  let lineNum = 0;
  for (const line of doc.toJSON()) {
    const regMatchL = interpreter.matchLine(line);
    if (regMatchL == null) {
      pos += line.length + 1;
      lineNum++;
      continue;
    }
    const label = interpreter.getLabel(regMatchL)
    if (label == undefined) {
      pos += line.length + 1
      lineNum++;
      continue
    }
    label.pos = pos
    label.line = lineNum
    list.push(label)
    const from = pos
    const isCustomType = interpreter.isCustomKey(label.type);
    const to = isCustomType ? from + 3 + label.tagName.length : from + 2
    const isSelect = selectFrom > pos - 1 && selectTo < pos + line.length + 1;
    if (isCustomType && isSelect) {
      const tagMark = Decoration.mark({ class: ' mv-label-active' })

      builder.add(from, to, tagMark)

      pos += line.length + 1
      lineNum++;
      continue
    }

    const replace = Decoration.replace({
      widget: new ModelvolLabelWidget(label),
    })

    builder.add(from, to, replace)

    pos += line.length + 1
    lineNum++;
  }
  store.labels = list
  return builder.finish();
}
export const labelField = StateField.define<DecorationSet>({
  create(state: EditorState): DecorationSet {
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
