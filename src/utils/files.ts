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
    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });
    
    // Write component file
    await writeFile(
      join(outputDir, `${componentName}.tsx`),
      generated.code
    );
    
    // Write styles if present
    if (generated.styles) {
      await writeFile(
        join(outputDir, `${componentName}.styles.ts`),
        generated.styles
      );
    }
    
    // Write types if present
    if (generated.types) {
      await writeFile(
        join(outputDir, `${componentName}.types.ts`),
        generated.types
      );
    }
    
    // Write stories if present
    if (generated.stories) {
      await writeFile(
        join(outputDir, `${componentName}.stories.tsx`),
        generated.stories
      );
    }
    
    // Write tests if present
    if (generated.tests) {
      await writeFile(
        join(outputDir, `${componentName}.test.tsx`),
        generated.tests
      );
    }
    
    // Write documentation if present
    if (generated.documentation) {
      await writeFile(
        join(outputDir, `${componentName}.md`),
        generated.documentation
      );
    }
  } catch (error) {
    throw new Error(`Failed to write generated files: ${error.message}`);
  }
} 