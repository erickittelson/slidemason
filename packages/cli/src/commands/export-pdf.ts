import { defineCommand } from 'citty';
import consola from 'consola';

export default defineCommand({
  meta: { name: 'export-pdf', description: 'Export deck to PDF' },
  args: {
    output: { type: 'string', description: 'Output PDF path', default: 'deck.pdf' },
    slides: { type: 'string', description: 'Number of slides', required: true },
  },
  async run({ args }) {
    const { exportPdf } = await import('@slidemason/export');
    consola.start('Exporting to PDF...');
    await exportPdf({
      url: 'http://localhost:4200',
      outputPath: args.output,
      slideCount: parseInt(args.slides, 10),
    });
    consola.success(`PDF exported to ${args.output}`);
  },
});
