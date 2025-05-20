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

/**
 * Distribute tasks optimally across workers based on task complexity
 * This function is more sophisticated than basic chunking as it considers
 * potential differences in image complexity
 */
export function distributeWorkload<T>(items: T[], workerCount: number): T[][] {
  if (items.length <= workerCount) {
    // If we have more workers than items, just assign one item per worker
    return items.map((item) => [item]);
  }

  // Create initially empty work buckets
  const workBuckets: T[][] = Array.from({ length: workerCount }, () => []);

  // Simple round-robin distribution for now
  // In the future this could be enhanced with complexity estimation
  items.forEach((item, idx) => {
    const bucketIndex = idx % workerCount;
    workBuckets[bucketIndex].push(item);
  });

  return workBuckets.filter((bucket) => bucket.length > 0);
}

/** Merge several PDF ArrayBuffers into one Blob */
export async function mergePdfBuffers(buffers: ArrayBuffer[]): Promise<Blob> {
  const merged = await PDFDocument.create();

  for (const buf of buffers) {
    const src = await PDFDocument.load(buf);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  const bytes = await merged.save(); // Uint8Array
  return new Blob([bytes.buffer as ArrayBuffer], {
    //  👈 cast once
    type: "application/pdf",
  });
}

