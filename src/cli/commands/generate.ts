import { Command } from 'commander';
import { CodeGenerator, FigmaService } from '../../core';
import { parseFigmaUrl } from '../../utils';
import dotenv from 'dotenv';

dotenv.config();

export const generateCommand = new Command('generate')
  .description('Generate code from a Figma section link')
  .argument('<figma-link>', 'Figma section link (copied from Figma)')
  .option('-o, --output <dir>', 'Output directory', './components')
  .action(async (figmaLink, options) => {
    try {
      console.log('🔍 Analyzing Figma section...');
      
      // Parse Figma URL to extract fileId and nodeId
      const { fileId, nodeId } = parseFigmaUrl(figmaLink);
      if (!fileId || !nodeId) {
        throw new Error('Invalid Figma link. Please copy the link from Figma using "Copy link to section"');
      }

      // Initialize services
      const figma = new FigmaService({
        accessToken: process.env.FIGMA_ACCESS_TOKEN || ''
      });

      const generator = new CodeGenerator({
        openaiApiKey: process.env.OPENAI_API_KEY,
        framework: process.env.FRAMEWORK || 'react',
        styling: process.env.STYLING || 'tailwind'
      });

      // Get component from Figma
      console.log('📥 Fetching component data...');
      const component = await figma.getComponent(fileId, nodeId);
      
      // Generate code
      console.log('⚙️ Generating code...');
      const generated = await generator.generateComponent(component);

      // Save the generated files
      const { writeGeneratedFiles } = await import('../../utils/files');
      await writeGeneratedFiles(generated, options.output);

      console.log('\n✨ Code generation complete!');
      console.log(`📁 Files written to: ${options.output}`);
      console.log('\nGenerated files:');
      console.log(`- Component: ${options.output}/${component.name}.tsx`);
      if (generated.styles) console.log(`- Styles: ${options.output}/${component.name}.styles.ts`);
      if (generated.types) console.log(`- Types: ${options.output}/${component.name}.types.ts`);
      if (generated.stories) console.log(`- Stories: ${options.output}/${component.name}.stories.tsx`);
      if (generated.tests) console.log(`- Tests: ${options.output}/${component.name}.test.tsx`);
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }); 