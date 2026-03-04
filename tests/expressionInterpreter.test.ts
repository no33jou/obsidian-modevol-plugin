import ExpressionInterpreter from "../src/ExpressionInterpreter";
import { LabelConfig } from "../src/settings";

function createConfigs(): LabelConfig[] {
  return [
    { key: "d", name: "描述", color: "#4B99D3", svgIcon: "", enabled: true },
    { key: "c", name: "自定义", color: "#CBC9CA", svgIcon: "", enabled: true, custom: true }
  ];
}

test("matches only enabled keys", () => {
  const configs = createConfigs();
  const interpreter = new ExpressionInterpreter(configs);
  const ok = interpreter.matchLine("#d 标题 关系");
  const fail = interpreter.matchLine("#x 其他");
  expect(ok).not.toBeNull();
  expect(fail).toBeNull();
});

test("parses normal label", () => {
  const configs = createConfigs();
  const interpreter = new ExpressionInterpreter(configs);
  const match = interpreter.matchLine("#d 标题 关系");
  expect(match).not.toBeNull();
  if (!match) return;
  const label = interpreter.getLabel(match);
  expect(label).toBeDefined();
  if (!label) return;
  expect(label.type).toBe("d");
  expect(label.tagName).toBe("描述");
  expect(label.title).toBe("标题");
  expect(label.relation).toBe("关系");
});

test("parses custom label with custom key", () => {
  const configs = createConfigs();
  const interpreter = new ExpressionInterpreter(configs);
  const match = interpreter.matchLine("#c 名称 标题 关系");
  expect(match).not.toBeNull();
  if (!match) return;
  const label = interpreter.getLabel(match);
  expect(label).toBeDefined();
  if (!label) return;
  expect(label.type).toBe("c");
  expect(label.tagName).toBe("名称");
  expect(label.title).toBe("标题");
  expect(label.relation).toBe("关系");
});

