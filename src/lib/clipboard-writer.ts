export type ClipboardWriteStatus = "copied" | "failed";

export async function writeClipboardText(copyText: string): Promise<ClipboardWriteStatus> {
  if (!navigator.clipboard?.writeText) {
    return "failed";
  }

  try {
    await navigator.clipboard.writeText(copyText);
    return "copied";
  } catch (clipboardWriteError) {
    if (isExpectedClipboardWriteFailure(clipboardWriteError)) {
      return "failed";
    }

    throw new Error(
      `Unexpected clipboard write error for text length ${Array.from(copyText).length}: ${String(
        clipboardWriteError
      )}`
    );
  }
}

function isExpectedClipboardWriteFailure(clipboardWriteError: unknown) {
  return (
    clipboardWriteError instanceof Error ||
    (typeof DOMException !== "undefined" && clipboardWriteError instanceof DOMException)
  );
}
