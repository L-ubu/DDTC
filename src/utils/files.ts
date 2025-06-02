import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { GeneratedComponent } from '../core/generator';

/**
 * Write generated component files to disk
 */
export async function writeGeneratedFiles(
  generated: GeneratedComponent,
  outputDir: string,
  componentName: string
): Promise<void> {
  try {
    // Create output directory if it doesn't exist
    await mkdir(outputDir, { recursive: true });
    
    // Write component file
    const componentPath = join(outputDir, `${componentName}.tsx`);
    await writeFile(componentPath, generated.code);
    
    // Write styles if present
    if (generated.styles) {
      const stylesPath = join(outputDir, `${componentName}.module.css`);
      await writeFile(stylesPath, generated.styles);
    }
    
    // Write types if present
    if (generated.types) {
      const typesPath = join(outputDir, `${componentName}.d.ts`);
      await writeFile(typesPath, generated.types);
    }
    
    // Write stories if present
    if (generated.stories) {
      const storiesPath = join(outputDir, `${componentName}.stories.tsx`);
      await writeFile(storiesPath, generated.stories);
    }
    
    // Write tests if present
    if (generated.tests) {
      const testsPath = join(outputDir, `${componentName}.test.tsx`);
      await writeFile(testsPath, generated.tests);
    }
    
    // Write documentation if present
    if (generated.documentation) {
      const docsPath = join(outputDir, `${componentName}.md`);
      await writeFile(docsPath, generated.documentation);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to write generated files: ${errorMessage}`);
  }
} 