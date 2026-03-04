import { isKnownTagSymbol, setLabelConfigs } from "../src/ModevolWidget";
import { DEFAULT_SETTINGS } from "../src/settings";
import ExpressionInterpreter from "../src/ExpressionInterpreter";

jest.mock('obsidian', () => ({
    MarkdownRenderChild: class {
        containerEl: HTMLElement;
        constructor(containerEl: HTMLElement) {
            this.containerEl = containerEl;
        }
        onload() { }
        onunload() { }
        load() { }
        unload() { }
    }
}), { virtual: true });
describe("Bug 2: Regex wildcard hijacking user spaces", () => {
    it("ExpressionInterpreter should only match configured labels", () => {
        const configs = [
            { key: "a", name: "A Label", color: "#000", svgIcon: "", enabled: true },
            { key: "b", name: "B Label", color: "#000", svgIcon: "", enabled: false }
        ];

        const interpreter = new ExpressionInterpreter(configs);

        // #a is enabled
        expect(interpreter.matchLine("#a Test")).not.toBeNull();

        // #b is disabled
        expect(interpreter.matchLine("#b Test")).toBeNull();

        // #x is unknown
        expect(interpreter.matchLine("#x Test")).toBeNull();
    });

    it("MarkdownPostProcessor should only process known tag symbols", () => {
        const configs = [
            { key: "y", name: "Y Label", color: "#000", svgIcon: "", enabled: true },
            { key: "z", name: "Z Label", color: "#000", svgIcon: "", enabled: false }
        ];

        setLabelConfigs(configs);

        // #y is enabled
        expect(isKnownTagSymbol("#y")).toBe(true);

        // #z is disabled
        expect(isKnownTagSymbol("#z")).toBe(false);

        // #unknown is unknown
        expect(isKnownTagSymbol("#unknown")).toBe(false);
    });
});
