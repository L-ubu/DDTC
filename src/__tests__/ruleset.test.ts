import { generateRuleset, RulesetConfig } from '../utils/ruleset-generator';
import { CursorRulesetService } from '../services/cursor-ruleset';
import fs from 'fs/promises';
import path from 'path';

const mockConfig: RulesetConfig = {
  projectName: 'test-project',
  framework: 'react',
  styling: 'tailwind',
  componentStructure: 'atomic',
  conventions: {
    naming: {
      components: true,
      props: true,
      styles: true
    },
    structure: {
      imports: true,
      exports: true,
      types: true
    },
    documentation: {
      jsdoc: true,
      readme: true,
      examples: true
    }
  }
};

describe('Ruleset Generator', () => {
  it('should generate a valid ruleset', async () => {
    const ruleset = await generateRuleset(mockConfig);
    
    expect(ruleset).toBeDefined();
    expect(ruleset.name).toBe('test-project-ruleset');
    expect(ruleset.rules).toBeInstanceOf(Array);
    expect(ruleset.examples).toBeDefined();
  });

  it('should include framework-specific rules', async () => {
    const ruleset = await generateRuleset(mockConfig);
    
    const reactRules = ruleset.rules.filter(rule => 
      rule.description.toLowerCase().includes('react')
    );
    expect(reactRules.length).toBeGreaterThan(0);
  });

  it('should generate valid examples', async () => {
    const ruleset = await generateRuleset(mockConfig);
    
    expect(ruleset.examples).toHaveProperty('ExampleComponent.tsx');
    expect(ruleset.examples['ExampleComponent.tsx']).toContain('import React');
  });
});

describe('CursorRulesetService', () => {
  const testDir = path.join(process.cwd(), '.cursor/rules/test');
  const examplesDir = path.join(testDir, 'examples');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await fs.mkdir(examplesDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should generate example files', async () => {
    const ruleset = await generateRuleset(mockConfig);
    const service = new CursorRulesetService({
      ruleset,
      projectRoot: process.cwd()
    });

    await service.applyRuleset(ruleset);
    const files = await fs.readdir(examplesDir);
    
    expect(files).toContain('ExampleComponent.tsx');
  });

  it('should remove ruleset successfully', async () => {
    const ruleset = await generateRuleset(mockConfig);
    const service = new CursorRulesetService({
      ruleset,
      projectRoot: process.cwd()
    });

    await service.applyRuleset(ruleset);
    await service.removeRuleset(ruleset.name);

    await expect(fs.access(testDir)).rejects.toThrow();
  });
}); 