import { GeneratedRuleset } from '../utils/ruleset-generator';
import { formatPath, ensureDir } from '../utils';
import fs from 'fs/promises';
import path from 'path';

export interface CursorRulesetConfig {
  ruleset: GeneratedRuleset;
  projectRoot: string;
  cursorConfigPath?: string;
}

/**
 * Service to manage Cursor rulesets
 */
export class CursorRulesetService {
  private configPath: string;
  private projectRoot: string;

  constructor({ ruleset, projectRoot, cursorConfigPath }: CursorRulesetConfig) {
    this.projectRoot = projectRoot;
    this.configPath = cursorConfigPath || path.join(projectRoot, '.cursor', 'rules');
  }

  /**
   * Applies a ruleset to the Cursor configuration
   */
  async applyRuleset(ruleset: GeneratedRuleset): Promise<void> {
    // Ensure the Cursor config directory exists
    await ensureDir(this.configPath);

    // Write the ruleset file
    const rulesetPath = path.join(this.configPath, `${ruleset.name}.json`);
    await fs.writeFile(rulesetPath, JSON.stringify(ruleset, null, 2));

    // Generate example files
    await this.generateExamples(ruleset);

    // Update Cursor config to include the new ruleset
    await this.updateCursorConfig(ruleset.name);
  }

  /**
   * Generates example files based on the ruleset
   */
  private async generateExamples(ruleset: GeneratedRuleset): Promise<void> {
    const examplesDir = path.join(this.projectRoot, '.cursor', 'examples');
    await ensureDir(examplesDir);

    for (const [name, content] of Object.entries(ruleset.examples)) {
      const filePath = path.join(examplesDir, `${name}-example.tsx`);
      await fs.writeFile(filePath, content);
    }
  }

  /**
   * Updates the main Cursor configuration to include the new ruleset
   */
  private async updateCursorConfig(rulesetName: string): Promise<void> {
    const cursorConfigPath = path.join(this.projectRoot, '.cursor', 'config.json');
    let config: any = {};

    try {
      const existingConfig = await fs.readFile(cursorConfigPath, 'utf-8');
      config = JSON.parse(existingConfig);
    } catch (error) {
      // Config doesn't exist yet, create new one
    }

    // Add or update rulesets section
    config.rulesets = config.rulesets || [];
    if (!config.rulesets.includes(rulesetName)) {
      config.rulesets.push(rulesetName);
    }

    await fs.writeFile(cursorConfigPath, JSON.stringify(config, null, 2));
  }

  /**
   * Removes a ruleset from Cursor configuration
   */
  async removeRuleset(rulesetName: string): Promise<void> {
    const rulesetPath = path.join(this.configPath, `${rulesetName}.json`);
    
    try {
      await fs.unlink(rulesetPath);
      await this.removeFromConfig(rulesetName);
    } catch (error) {
      console.error(`Failed to remove ruleset ${rulesetName}:`, error);
    }
  }

  /**
   * Removes a ruleset from the Cursor config file
   */
  private async removeFromConfig(rulesetName: string): Promise<void> {
    const cursorConfigPath = path.join(this.projectRoot, '.cursor', 'config.json');
    
    try {
      const existingConfig = await fs.readFile(cursorConfigPath, 'utf-8');
      const config = JSON.parse(existingConfig);
      
      if (config.rulesets) {
        config.rulesets = config.rulesets.filter((name: string) => name !== rulesetName);
        await fs.writeFile(cursorConfigPath, JSON.stringify(config, null, 2));
      }
    } catch (error) {
      console.error('Failed to update Cursor config:', error);
    }
  }
} 