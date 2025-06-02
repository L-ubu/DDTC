import { Command } from 'commander';
import { CodeGenerator, FigmaService } from '../../core';
import { parseFigmaUrl, writeGeneratedFiles } from '../../utils';
import path from 'path';

export const generateCommand = new Command('generate')
  .description('Generate code from Figma components')
  .argument('[url]', 'Figma component URL')
  .option('-f, --file <string>', 'Figma file ID')
  .option('-c, --component <string>', 'Component ID')
  .option('-o, --output <string>', 'Output directory', './components')
  .option('--framework <string>', 'Target framework', 'react')
  .option('--styling <string>', 'Styling solution', 'tailwind')
  .action(async (url, options) => {
    try {
      let fileId = options.file;
      let componentId = options.component;

      if (url) {
        const parsed = parseFigmaUrl(url);
        fileId = parsed.fileId;
        componentId = parsed.nodeId;
      }

      if (!fileId) {
        throw new Error('Please provide either a Figma URL or file ID');
      }

      const figma = new FigmaService({
        accessToken: process.env.FIGMA_ACCESS_TOKEN || '',
        fileId
      });

      const generator = new CodeGenerator({
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        framework: options.framework,
        styling: options.styling
      });

      if (componentId) {
        const component = await figma.getFileComponents(fileId);
        const generated = await generator.generateComponent(component[0]);
        const componentName = path.basename(component[0].name);
        await writeGeneratedFiles(generated, options.output, componentName);
      } else {
        const components = await figma.getFileComponents(fileId);
        for (const component of components) {
          const generated = await generator.generateComponent(component);
          const componentName = path.basename(component.name);
          await writeGeneratedFiles(generated, options.output, componentName);
        }
      }

      console.log('✨ Code generation completed successfully!');
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Error:', error.message);
      } else {
        console.error('❌ An unknown error occurred');
      }
      process.exit(1);
    }
  }); 