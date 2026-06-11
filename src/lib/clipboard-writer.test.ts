import { describe, expect, it, vi } from "vitest";

import { writeClipboardText } from "./clipboard-writer";

function defineClipboardWriteText(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText }
  });
}

describe("writeClipboardText", () => {
  it("returns copied when the browser clipboard accepts the text", async () => {
    defineClipboardWriteText(vi.fn().mockResolvedValue(undefined));

    await expect(writeClipboardText("hello world")).resolves.toBe("copied");
  });

  it("returns failed for expected browser clipboard rejection", async () => {
    defineClipboardWriteText(vi.fn().mockRejectedValue(new Error("permission denied")));

    await expect(writeClipboardText("hello world")).resolves.toBe("failed");
  });

  it("throws when clipboard rejects with an unexpected value", async () => {
    defineClipboardWriteText(vi.fn().mockRejectedValue("not-an-error"));

    await expect(writeClipboardText("hello world")).rejects.toThrow(
      "Unexpected clipboard write error for text length 11: not-an-error"
    );
  });
});
