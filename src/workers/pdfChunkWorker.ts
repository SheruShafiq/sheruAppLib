// src/workers/pdfChunkWorker.ts
import { jsPDF } from "jspdf";

export type MsgIn = {
  images: string[];
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  workerIndex: number;
};

self.onmessage = (e: MessageEvent<MsgIn>) => {
  const { images, width, height, orientation, workerIndex } = e.data;

  const doc = new jsPDF({
    orientation,
    unit: "px",
    format: [width, height],
    hotfixes: ["px_scaling"],
  });

  images.forEach((img, i) => {
    if (i) doc.addPage();
    doc.addImage(img, "JPEG", 0, 0, width, height, undefined, "FAST");

    // Report progress back to main thread
    if (i % Math.max(1, Math.floor(images.length / 10)) === 0) {
      const progress = Math.round((i / images.length) * 100);
      (self as any).postMessage({ progress, workerIndex });
    }
  });

  // Return raw bytes instead of a Blob – makes merging trivial.
  const pdfBytes = doc.output("arraybuffer");
  (self as any).postMessage({ pdfBytes, workerIndex }, [pdfBytes]);
};
