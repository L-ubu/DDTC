import OpenAI from 'openai';
import { ComponentNode } from './figma';

export interface GeneratorConfig {
  openaiApiKey: string;
  model?: string;
  temperature?: number;
  framework?: 'react' | 'vue' | 'svelte' | 'solid' | 'angular' | 'custom';
  customFramework?: string;
  styling?: 'css' | 'tailwind' | 'css-modules' | 'styled-components' | 'custom';
  customStyling?: string;
  features?: {
    typescript?: boolean;
    storybook?: boolean;
    tests?: boolean;
    accessibility?: boolean;
  };
}

export interface GeneratedComponent {
  code: string;
  styles: string;
  dependencies: string[];
  types?: string;
  stories?: string;
  tests?: string;
  documentation?: string;
}

export class CodeGenerator {
  private openai: OpenAI;
  private model: string;
  private temperature: number;
  private framework: string;
  private styling: string;
  private features: Required<GeneratorConfig>['features'];

  constructor(config: GeneratorConfig) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey
    });
    this.model = config.model || 'gpt-4';
    this.temperature = config.temperature || 0.7;
    this.framework = config.framework || 'react';
    this.styling = config.styling || 'tailwind';
    this.features = {
      typescript: config.features?.typescript ?? true,
      storybook: config.features?.storybook ?? false,
      tests: config.features?.tests ?? false,
      accessibility: config.features?.accessibility ?? true
    };
  }

  async generateComponent(component: ComponentNode): Promise<GeneratedComponent> {
    try {
      const prompt = this.buildPrompt(component);
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.temperature
      });

      const generatedCode = response.choices[0]?.message?.content || '';
      return this.parseGeneratedCode(generatedCode);
    } catch (error) {
      throw error;
    }
  }

  private getSystemPrompt(): string {
    return `You are a professional front-end developer. Generate clean, semantic ${this.framework} components with ${this.features.typescript ? 'TypeScript' : 'JavaScript'} and modern best practices.
Focus on:
- Semantic HTML and accessibility
- Clean, maintainable code structure
- ${this.styling === 'tailwind' ? 'Efficient Tailwind utilities' : 'Clean, modular styles'}
- Proper component organization
- Type safety and documentation
- Responsive design patterns`;
  }

  private buildPrompt(component: ComponentNode): string {
    const features = [];
    if (this.features.typescript) features.push('TypeScript types/interfaces');
    if (this.features.storybook) features.push('Storybook stories');
    if (this.features.tests) features.push('Unit tests');
    if (this.features.accessibility) features.push('Accessibility features (ARIA attributes, keyboard navigation)');

    return `Generate a ${this.framework} component for the following Figma component:
Name: ${component.name}
Type: ${component.type}
Structure: ${JSON.stringify(component, null, 2)}

Please include:
${features.map(f => `- ${f}`).join('\n')}
- Proper component structure
- ${this.styling === 'tailwind' ? 'Tailwind CSS classes' : 'CSS styles'}
- Any necessary imports
- Component documentation
- Props validation
- Error boundaries
- Loading states
- Interactive states (hover, focus, active)

Return the code in markdown code blocks:
- Component: \`\`\`${this.features.typescript ? 'tsx' : 'jsx'}\`\`\`
- Styles: \`\`\`${this.styling}\`\`\`
${this.features.storybook ? '- Stories: \`\`\`tsx\`\`\`' : ''}
${this.features.tests ? '- Tests: \`\`\`tsx\`\`\`' : ''}
- Types: \`\`\`typescript\`\`\`
- Documentation: \`\`\`markdown\`\`\``;
  }

  private parseGeneratedCode(rawCode: string): GeneratedComponent {
    const result: GeneratedComponent = {
      code: '',
      styles: '',
      dependencies: [],
      types: '',
      stories: '',
      tests: '',
      documentation: ''
    };

    // Extract code blocks using consistent language identifiers
    const codeMatch = rawCode.match(/```(?:tsx?|jsx)\n([\s\S]*?)```/);
    const stylesMatch = rawCode.match(/```(?:css|tailwind|scss|styled-components)\n([\s\S]*?)```/);
    const storiesMatch = rawCode.match(/```tsx\n([\s\S]*?)```/);
    const testsMatch = rawCode.match(/```tsx\n([\s\S]*?)```/);
    const typesMatch = rawCode.match(/```typescript\n([\s\S]*?)```/);
    const docsMatch = rawCode.match(/```markdown\n([\s\S]*?)```/);

    if (codeMatch) {
      result.code = codeMatch[1].trim();
      result.dependencies = this.extractDependencies(result.code);
    }

    if (stylesMatch) result.styles = stylesMatch[1].trim();
    if (storiesMatch) result.stories = storiesMatch[1].trim();
    if (testsMatch) result.tests = testsMatch[1].trim();
    if (typesMatch) result.types = typesMatch[1].trim();
    if (docsMatch) result.documentation = docsMatch[1].trim();

    return result;
  }

  private extractDependencies(code: string): string[] {
    const importRegex = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;
    const matches = code.match(importRegex) || [];
    
    return matches.map(match => {
      const moduleMatch = match.match(/from\s+['"]([^'"]+)['"]/);
      return moduleMatch ? moduleMatch[1] : '';
    }).filter(Boolean);
  }
} 