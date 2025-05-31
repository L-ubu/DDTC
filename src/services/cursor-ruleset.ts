import fs from 'fs/promises';
import path from 'path';
import { GeneratedRuleset } from '../utils/ruleset-generator';

export interface CursorRulesetConfig {
  ruleset: GeneratedRuleset;
  projectRoot: string;
  cursorConfigPath?: string;
}

interface CursorConfig {
  rulesets: string[];
}

/**
 * Service to manage Cursor rulesets
 */
export class CursorRulesetService {
  private configPath: string;
  private projectRoot: string;

  constructor({ ruleset, projectRoot, cursorConfigPath }: CursorRulesetConfig) {
    this.projectRoot = projectRoot;
    this.configPath = cursorConfigPath || path.join(projectRoot, '.cursor', 'config.json');
  }

  /**
   * Applies a ruleset to the Cursor configuration
   */
  async applyRuleset(ruleset: GeneratedRuleset): Promise<void> {
    const rulesetDir = path.join(this.projectRoot, '.cursor/rules', ruleset.name);
    const examplesDir = path.join(rulesetDir, 'examples');

    // Create directories
    await fs.mkdir(rulesetDir, { recursive: true });
    await fs.mkdir(examplesDir, { recursive: true });

    // Save ruleset configuration
    await fs.writeFile(
      path.join(rulesetDir, 'ruleset.json'),
      JSON.stringify(ruleset, null, 2)
    );

    // Generate example files
    await this.generateExamples(ruleset);

    // Update Cursor config
    await this.updateCursorConfig(ruleset.name);
  }

  /**
   * Generates example files based on the ruleset
   */
  private async generateExamples(ruleset: GeneratedRuleset): Promise<void> {
    const examplesDir = path.join(this.projectRoot, '.cursor/rules', ruleset.name, 'examples');
    
    for (const [filename, content] of Object.entries(ruleset.examples)) {
      if (content) {
        await fs.writeFile(path.join(examplesDir, filename), content);
      }
    }
  }

  /**
   * Updates the main Cursor configuration to include the new ruleset
   */
  private async updateCursorConfig(rulesetName: string): Promise<void> {
    try {
      let config: CursorConfig = { rulesets: [] };

      try {
        const configContent = await fs.readFile(this.configPath, 'utf-8');
        config = JSON.parse(configContent);
      } catch (error) {
        // Config doesn't exist yet, use default
      }

      if (!config.rulesets.includes(rulesetName)) {
        config.rulesets.push(rulesetName);
      }

      await fs.mkdir(path.dirname(this.configPath), { recursive: true });
      await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      throw new Error(`Failed to update Cursor config: ${error}`);
    }
  }

  /**
   * Removes a ruleset from Cursor configuration
   */
  async removeRuleset(rulesetName: string): Promise<void> {
    const rulesetDir = path.join(this.projectRoot, '.cursor/rules', rulesetName);
    
    try {
      await fs.rm(rulesetDir, { recursive: true, force: true });
      await this.removeFromConfig(rulesetName);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Removes a ruleset from the Cursor config file
   */
  private async removeFromConfig(rulesetName: string): Promise<void> {
    try {
      const configContent = await fs.readFile(this.configPath, 'utf-8');
      const config: CursorConfig = JSON.parse(configContent);

      config.rulesets = config.rulesets.filter(name => name !== rulesetName);

      await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      // If config doesn't exist, nothing to remove
    }
  }
} 