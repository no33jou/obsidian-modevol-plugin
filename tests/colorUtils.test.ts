import { hexToRgba, isValidHexColor } from "../src/colorUtils";

describe("Bug 10: hexToRgba utility", () => {
  it("converts 6-digit hex to rgba", () => {
    expect(hexToRgba("#4B99D3", 0.3)).toBe("rgba(75, 153, 211, 0.3)");
    expect(hexToRgba("#CD5255", 0.3)).toBe("rgba(205, 82, 85, 0.3)");
  });

  it("handles 3-digit hex", () => {
    expect(hexToRgba("#fff", 1)).toBe("rgba(255, 255, 255, 1)");
    expect(hexToRgba("#000", 0.5)).toBe("rgba(0, 0, 0, 0.5)");
  });

  it("returns fallback rgba for invalid input", () => {
    expect(hexToRgba("not-a-color", 0.5)).toBe("rgba(0, 0, 0, 0.5)");
    expect(hexToRgba("#12", 0.5)).toBe("rgba(0, 0, 0, 0.5)");
    expect(hexToRgba("#zzzzzz", 0.5)).toBe("rgba(0, 0, 0, 0.5)");
  });
});

describe("isValidHexColor utility", () => {
  it("validates correct 6-digit hex colors", () => {
    expect(isValidHexColor("#4B99D3")).toBe(true);
    expect(isValidHexColor("#ffffff")).toBe(true);
    expect(isValidHexColor("#000000")).toBe(true);
    expect(isValidHexColor("#ABCDEF")).toBe(true);
  });

  it("validates correct 3-digit hex colors", () => {
    expect(isValidHexColor("#fff")).toBe(true);
    expect(isValidHexColor("#000")).toBe(true);
    expect(isValidHexColor("#abc")).toBe(true);
  });

  it("rejects invalid colors", () => {
    expect(isValidHexColor("4B99D3")).toBe(false);
    expect(isValidHexColor("#gggggg")).toBe(false);
    expect(isValidHexColor("#12")).toBe(false);
    expect(isValidHexColor("#12345")).toBe(false);
    expect(isValidHexColor("")).toBe(false);
    expect(isValidHexColor("red")).toBe(false);
  });
});

