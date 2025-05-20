// very small, keep it tree-shakable
import { PDFDocument } from "pdf-lib";

/** Split an array into roughly equal-sized chunks */
/** Split `arr` into ≤ nChunks non-empty slices */
export function chunk<T>(arr: T[], nChunks: number): T[][] {
  const size = Math.ceil(arr.length / Math.min(nChunks, arr.length));
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}


/** Merge several PDF ArrayBuffers into one Blob */
export async function mergePdfBuffers(buffers: ArrayBuffer[]): Promise<Blob> {
  const merged = await PDFDocument.create();

  for (const buf of buffers) {
    const src    = await PDFDocument.load(buf);
    const pages  = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  const bytes = await merged.save();                       // Uint8Array
  return new Blob([bytes.buffer as ArrayBuffer], {         //  👈 cast once
    type: "application/pdf",
  });
}

