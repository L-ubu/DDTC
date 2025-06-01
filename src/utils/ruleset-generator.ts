import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob-promise';

export interface RulesetConfig {
  projectName: string;
  framework: 'react' | 'vue' | 'angular' | 'next' | 'nuxt' | 'svelte' | 'solid' | 'astro' | 'remix' | 'custom';
  customFramework?: string;
  styling: 'tailwind' | 'css-modules' | 'styled-components' | 'scss' | 'emotion' | 'stitches' | 'vanilla-extract' | 'custom';
  customStyling?: string;
  componentStructure: 'atomic' | 'feature-based' | 'flat' | 'custom';
  customStructure?: string;
  projectRoot: string;
  conventions: {
    naming?: {
      components?: boolean;
      props?: boolean;
      styles?: boolean;
    };
    structure?: {
      imports?: boolean;
      exports?: boolean;
      types?: boolean;
    };
    documentation?: {
      jsdoc?: boolean;
      readme?: boolean;
      examples?: boolean;
    };
  };
}

export interface GeneratedRuleset {
  name: string;
  rules: Rule[];
  examples: { [key: string]: string };
}

interface Rule {
  name: string;
  description: string;
  pattern: string;
  severity: 'error' | 'warning' | 'info';
  category: 'naming' | 'structure' | 'documentation' | 'styling';
}

interface ProjectAnalysis {
  componentPatterns: {
    naming: string[];
    structure: string[];
    imports: string[];
    exports: string[];
  };
  stylePatterns: {
    naming: string[];
    structure: string[];
  };
  documentationPatterns: {
    jsdoc: string[];
    examples: string[];
  };
}

/**
 * Generates a project-specific ruleset based on configuration
 */
export async function generateRuleset(config: RulesetConfig): Promise<GeneratedRuleset> {
  // Analyze existing project code
  const analysis = await analyzeProject(config.projectRoot);
  
  const rules: Rule[] = [];
  const examples: { [key: string]: string } = {};

  // Generate naming convention rules based on analysis
  if (config.conventions.naming?.components) {
    rules.push({
      name: 'component-naming',
      description: 'Component names should follow project conventions',
      pattern: analysis.componentPatterns.naming[0] || '[A-Z][a-zA-Z]+',
      severity: 'error',
      category: 'naming'
    });
  }

  // Generate structure rules based on analysis
  if (config.conventions.structure?.imports) {
    rules.push({
      name: 'import-structure',
      description: 'Import statements should follow project conventions',
      pattern: analysis.componentPatterns.imports[0] || '^import.*from',
      severity: 'warning',
      category: 'structure'
    });
  }

  // Generate documentation rules based on analysis
  if (config.conventions.documentation?.jsdoc) {
    rules.push({
      name: 'jsdoc-required',
      description: 'Components should have JSDoc documentation',
      pattern: analysis.documentationPatterns.jsdoc[0] || '/\\*\\*[\\s\\S]*?\\*/',
      severity: 'warning',
      category: 'documentation'
    });
  }

  // Add example based on analyzed patterns
  const exampleComponent = await findBestExampleComponent(config.projectRoot, config.framework);
  if (exampleComponent) {
    examples[`${config.framework}-component`] = exampleComponent;
  }

  return {
    name: `${config.projectName}-ruleset`,
    rules,
    examples
  };
}

async function analyzeProject(projectRoot: string): Promise<ProjectAnalysis> {
  const analysis: ProjectAnalysis = {
    componentPatterns: {
      naming: [],
      structure: [],
      imports: [],
      exports: []
    },
    stylePatterns: {
      naming: [],
      structure: []
    },
    documentationPatterns: {
      jsdoc: [],
      examples: []
    }
  };

  try {
    // Find all TypeScript/JavaScript files
    const files = await glob('**/*.{ts,tsx,js,jsx}', {
      cwd: projectRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/__tests__/**']
    });

    for (const file of files) {
      const content = await fs.readFile(path.join(projectRoot, file), 'utf-8');
      
      // Analyze component naming patterns
      const componentNameMatch = content.match(/(?:class|interface|function)\s+([A-Z][a-zA-Z]+)/g);
      if (componentNameMatch) {
        analysis.componentPatterns.naming.push(...componentNameMatch);
      }

      // Analyze import patterns
      const importMatches = content.match(/import\s+.*\s+from\s+['"][^'"]+['"];?/g);
      if (importMatches) {
        analysis.componentPatterns.imports.push(...importMatches);
      }

      // Analyze JSDoc patterns
      const jsdocMatches = content.match(/\/\*\*[\s\S]*?\*\//g);
      if (jsdocMatches) {
        analysis.documentationPatterns.jsdoc.push(...jsdocMatches);
      }
    }

    // Find all style files
    const styleFiles = await glob('**/*.{css,scss,less,styled.{ts,js}}', {
      cwd: projectRoot,
      ignore: ['**/node_modules/**', '**/dist/**']
    });

    for (const file of styleFiles) {
      const content = await fs.readFile(path.join(projectRoot, file), 'utf-8');
      
      // Analyze style naming patterns
      const classMatches = content.match(/\.[a-zA-Z][a-zA-Z0-9-_]*/g);
      if (classMatches) {
        analysis.stylePatterns.naming.push(...classMatches);
      }
    }

  } catch (error) {
    console.error('Error analyzing project:', error);
  }

  return analysis;
}

async function findBestExampleComponent(projectRoot: string, framework: string): Promise<string | null> {
  try {
    // Find component files based on framework
    const extension = framework === 'react' ? '{tsx,jsx}' : 
                     framework === 'vue' ? 'vue' :
                     framework === 'svelte' ? 'svelte' : 'ts';
    
    const files = await glob(`**/*.${extension}`, {
      cwd: projectRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/__tests__/**']
    });

    // Find the most representative component
    for (const file of files) {
      const content = await fs.readFile(path.join(projectRoot, file), 'utf-8');
      
      // Look for components with props, state, and documentation
      if (content.includes('props') && 
          content.includes('export') && 
          content.includes('/**')) {
        return content;
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding example component:', error);
    return null;
  }
} 