#!/usr/bin/env node

import { Command } from 'commander';
import { FigmaService, FigmaConfig } from '../core/figma';
import { CodeGenerator, GeneratorConfig } from '../core/generator';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { rulesetCommand } from './commands/ruleset';

dotenv.config();

const program = new Command();

program
  .name('dynamate-design-to-code')
  .description('CLI tool for converting Figma designs to code with Cursor integration')
  .version('1.0.0');

program.addCommand(rulesetCommand);

program
  .command('generate')
  .description('Generate code from Figma components')
  .requiredOption('-f, --file <string>', 'Figma file ID')
  .option('-o, --output <string>', 'Output directory', './components')
  .option('-t, --type <string>', 'Output type (react)', 'react')
  .action(async (options) => {
    try {
      const figmaConfig: FigmaConfig = {
        accessToken: process.env.FIGMA_ACCESS_TOKEN || '',
        fileId: options.file
      };

      const generatorConfig: GeneratorConfig = {
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.MODEL || 'gpt-4',
        temperature: parseFloat(process.env.TEMPERATURE || '0.7')
      };

      const figma = new FigmaService(figmaConfig);
      const generator = new CodeGenerator(generatorConfig);

      // Create output directory if it doesn't exist
      await fs.mkdir(options.output, { recursive: true });

      // Get components from Figma
      const components = await figma.getFileComponents(options.file);
      console.log(`Found ${components.length} components`);

      // Generate code for each component
      for (const component of components) {
        console.log(`Generating code for ${component.name}...`);
        const generated = await generator.generateComponent(component);

        // Create component file
        const fileName = `${component.name.replace(/\s+/g, '')}.tsx`;
        const filePath = path.join(options.output, fileName);

        // Write component code
        await fs.writeFile(filePath, generated.code);

        // Write styles if any
        if (generated.styles) {
          const stylePath = path.join(options.output, `${component.name.replace(/\s+/g, '')}.css`);
          await fs.writeFile(stylePath, generated.styles);
        }

        console.log(`Generated ${fileName}`);
      }

      console.log('Code generation completed successfully!');
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse(process.argv); 