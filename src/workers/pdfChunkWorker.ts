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

  // Report initial status immediately
  (self as any).postMessage({ progress: 0, workerIndex });

  // More frequent progress updates for better visualization - at least 10 updates
  const reportFrequency = Math.max(1, Math.ceil(images.length / 20));
  
  let lastReportedProgress = 0;

  images.forEach((img, i) => {
    if (i) doc.addPage();
    doc.addImage(img, "JPEG", 0, 0, width, height, undefined, "FAST");
    
    // Calculate current progress percentage
    const currentProgress = Math.round(((i + 1) / images.length) * 100);
    
    // Report progress if enough has changed or we're at the end
    if (currentProgress - lastReportedProgress >= 5 || i % reportFrequency === 0 || i === images.length - 1) {
      lastReportedProgress = currentProgress;
      (self as any).postMessage({ progress: currentProgress, workerIndex });
    }
  });

  // Return raw bytes instead of a Blob – makes merging trivial.
  const pdfBytes = doc.output("arraybuffer");
  (self as any).postMessage({ pdfBytes, workerIndex }, [pdfBytes]);
};
