import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import { writeFile } from 'node:fs/promises';

interface ExportPdfOptions {
  url: string;
  outputPath: string;
  slideCount: number;
}

export async function exportPdf({ url, outputPath, slideCount }: ExportPdfOptions): Promise<void> {
  if (slideCount < 1) {
    throw new Error('slideCount must be at least 1');
  }

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < slideCount; i++) {
      await page.goto(`${url}?slide=${i}`, { waitUntil: 'networkidle' });
      const pdfBytes = await page.pdf({
        width: '1920px',
        height: '1080px',
        printBackground: true,
      });

      const slidePdf = await PDFDocument.load(pdfBytes);
      const [copiedPage] = await mergedPdf.copyPages(slidePdf, [0]);
      mergedPdf.addPage(copiedPage);
    }

    const finalPdf = await mergedPdf.save();
    await writeFile(outputPath, finalPdf);
  } finally {
    await browser.close();
  }
}
