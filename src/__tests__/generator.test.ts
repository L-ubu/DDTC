import { CodeGenerator, GeneratorConfig, GeneratedComponent } from '../core/generator';
import { ComponentNode } from '../core/figma';
import OpenAI from 'openai';

jest.mock('openai');

describe('CodeGenerator', () => {
  let generator: CodeGenerator;
  const mockConfig: GeneratorConfig = {
    openaiApiKey: 'mock-key',
    model: 'gpt-4',
    temperature: 0.7
  };

  const mockComponent: ComponentNode = {
    id: 'test-id',
    name: 'TestComponent',
    type: 'COMPONENT'
  };

  const mockResponse = {
    choices: [
      {
        message: {
          content: `
            import React from 'react';
            import './TestComponent.css';

            export const TestComponent = () => {
              return <div>Test Component</div>;
            };
          `
        }
      }
    ]
  };

  beforeEach(() => {
    generator = new CodeGenerator(mockConfig);
  });

  describe('generateComponent', () => {
    it('should generate code for a component', async () => {
      // Mock the OpenAI chat completion
      (OpenAI as jest.MockedClass<typeof OpenAI>).prototype.chat.completions.create = 
        jest.fn().mockResolvedValue(mockResponse);

      const result = await generator.generateComponent(mockComponent);

      expect(result).toBeDefined();
      expect(result.code).toContain('import React');
      expect(result.code).toContain('TestComponent');
    });

    it('should handle errors during code generation', async () => {
      // Mock API error
      (OpenAI as jest.MockedClass<typeof OpenAI>).prototype.chat.completions.create = 
        jest.fn().mockRejectedValue(new Error('API Error'));

      await expect(generator.generateComponent(mockComponent)).rejects.toThrow('API Error');
    });
  });

  describe('parseGeneratedCode', () => {
    it('should correctly parse code and styles from raw response', () => {
      const rawCode = `
\`\`\`tsx
import React from 'react';
import { motion } from 'framer-motion';

export const Card = () => {
  return <div>Card</div>;
};
\`\`\`

\`\`\`css
.card {
  padding: 1rem;
}
\`\`\`
`;

      const result = generator['parseGeneratedCode'](rawCode);

      expect(result.code).toContain('export const Card');
      expect(result.styles).toContain('padding: 1rem');
      expect(result.dependencies).toContain('react');
      expect(result.dependencies).toContain('framer-motion');
    });

    it('should handle missing code blocks gracefully', () => {
      const rawCode = 'No code blocks here';

      const result = generator['parseGeneratedCode'](rawCode);

      expect(result.code).toBe('');
      expect(result.styles).toBe('');
      expect(result.dependencies).toHaveLength(0);
    });
  });
}); 