export async function saveNodeAsPng(node: HTMLElement, fileName: string): Promise<void> {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2
  });

  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.href = dataUrl;
  downloadLink.click();
}
