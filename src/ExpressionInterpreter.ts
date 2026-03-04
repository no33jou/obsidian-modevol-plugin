import { Label } from "./Label";
import { LabelConfig } from "./settings";

export default class ExpressionInterpreter {
    private readonly labelConfigs: Map<string, LabelConfig>;
    private readonly tagReg: RegExp;
    private readonly customKeys: Set<string>;

    constructor(labelConfigs: LabelConfig[]) {
        this.labelConfigs = new Map();
        labelConfigs.forEach(config => {
            if (!config.enabled) {
                return;
            }
            this.labelConfigs.set(config.key, config);
        });
        const enabledKeys = Array.from(this.labelConfigs.keys());
        const keys = enabledKeys.length > 0 ? enabledKeys.join("") : "devtc";
        this.tagReg = new RegExp(`^#([${keys}])(?=\\s)(.*|$)`);
        const customKeys = new Set<string>();
        labelConfigs.forEach(config => {
            if (!config.enabled) {
                return;
            }
            if (config.custom) {
                customKeys.add(config.key);
            }
        });
        if (customKeys.size === 0 && this.labelConfigs.has("c")) {
            customKeys.add("c");
        }
        this.customKeys = customKeys;
    }

    isCustomKey(key: string): boolean {
        return this.customKeys.has(key);
    }

    matchLine(line: string): RegExpExecArray | null {
        return this.tagReg.exec(line);
    }

    getLabel(regArray: RegExpExecArray): Label | undefined {
        const tag = regArray[1].toLowerCase();
        if (this.customKeys.has(tag)) {
            const config = this.labelConfigs.get(tag);
            return this.customInterpret(regArray, tag, config);
        }
        const config = this.labelConfigs.get(tag);
        if (config) {
            return this.normalInterpret(regArray, config);
        }
        return undefined;
    }

    private normalInterpret(regArray: RegExpExecArray, config: LabelConfig): Label {
        const label = new Label();
        label.type = config.key;
        label.tagName = config.name;
        label.text = regArray[0];
        label.color = config.color;
        label.content = label.text.substring(2);
        const list = label.content.trim().split(" ");
        label.title = list.length > 0 ? list[0] : "";
        label.relation = list.length > 1 ? list[1] : "";
        return label;
    }

    private customInterpret(regArray: RegExpExecArray, key: string, config?: LabelConfig): Label | undefined {
        const label = new Label();
        label.text = regArray[0];
        label.type = key;
        if (config) {
            label.color = config.color;
        }
        const list = label.text.substring(2).trim().split(/\s+/);
        if (list.length <= 0 || list[0].length === 0) {
            return undefined;
        }
        label.tagName = list.length > 0 ? list[0] : "";
        label.title = list.length > 1 ? list[1] : "";
        label.relation = list.length > 2 ? list[2] : "";
        label.content = label.text.substring(3 + label.tagName.length);
        return label;
    }
}
