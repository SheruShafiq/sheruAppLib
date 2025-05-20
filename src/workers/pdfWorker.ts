import { jsPDF } from "jspdf";

type MsgIn = {
  images: string[];
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
};

self.onmessage = async (e: MessageEvent<MsgIn>) => {
  const { images, width, height, orientation } = e.data;
  const doc = new jsPDF({
    orientation,
    unit: "px",
    format: [width, height],
  });

  for (let i = 0; i < images.length; i++) {
    if (i > 0) doc.addPage();
    doc.addImage(images[i], "JPEG", 0, 0, width, height);
    const prog = Math.round(((i + 1) / images.length) * 100);
    (self as any).postMessage({ progress: prog });
  }

  const blob = doc.output("blob");
  (self as any).postMessage({ pdfBlob: blob });
};
