import OpenAI from 'openai';
import { ComponentNode } from './figma';

export interface GeneratorConfig {
  openaiApiKey: string;
  model?: string;
  temperature?: number;
}

export interface GeneratedComponent {
  code: string;
  styles: string;
  dependencies: string[];
}

export class CodeGenerator {
  private openai: OpenAI;
  private model: string;
  private temperature: number;

  constructor(config: GeneratorConfig) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey
    });
    this.model = config.model || 'gpt-3.5-turbo';
    this.temperature = config.temperature || 0.7;
  }

  async generateComponent(component: ComponentNode): Promise<GeneratedComponent> {
    try {
      const prompt = this.buildPrompt(component);
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional front-end developer. Generate clean, semantic React components with TypeScript and modern best practices.'
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

  private buildPrompt(component: ComponentNode): string {
    return `Generate a React component for the following Figma component:
Name: ${component.name}
Type: ${component.type}

Please include:
1. TypeScript types/interfaces
2. Proper component structure
3. CSS styles (if needed)
4. Any necessary imports

Return the code in markdown code blocks (tsx for component, css for styles).`;
  }

  private parseGeneratedCode(rawCode: string): GeneratedComponent {
    const result: GeneratedComponent = {
      code: '',
      styles: '',
      dependencies: []
    };

    // Extract code blocks
    const tsxMatch = rawCode.match(/```tsx?\n([\s\S]*?)```/);
    const cssMatch = rawCode.match(/```css\n([\s\S]*?)```/);

    if (tsxMatch) {
      result.code = tsxMatch[1].trim();
      result.dependencies = this.extractDependencies(result.code);
    }

    if (cssMatch) {
      result.styles = cssMatch[1].trim();
    }

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