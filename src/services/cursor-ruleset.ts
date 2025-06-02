import { readdir, readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { GeneratedRuleset } from '../utils/ruleset-generator';

export interface Ruleset {
  name: string;
  rules: Rule[];
  examples: Record<string, string>;
}

export interface Rule {
  name: string;
  description: string;
  pattern: string;
  fix?: string;
}

interface CursorRulesetConfig {
  ruleset: Ruleset;
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
  private ruleset: Ruleset;
  private projectRoot: string;
  private rulesDir: string;
  private configPath: string;

  constructor(config: CursorRulesetConfig) {
    this.ruleset = config.ruleset;
    this.projectRoot = config.projectRoot;
    this.rulesDir = join(this.projectRoot, '.cursor', 'rules');
    this.configPath = config.cursorConfigPath || join(this.projectRoot, '.cursor', 'config.json');
  }

  /**
   * Applies a ruleset to the Cursor configuration
   */
  async applyRuleset(ruleset: Ruleset): Promise<void> {
    // Ensure rules directory exists
    if (!existsSync(this.rulesDir)) {
      await mkdir(this.rulesDir, { recursive: true });
    }

    const rulesetDir = join(this.rulesDir, ruleset.name);
    if (!existsSync(rulesetDir)) {
      await mkdir(rulesetDir, { recursive: true });
    }

    // Save ruleset configuration
    await writeFile(
      join(rulesetDir, 'ruleset.json'),
      JSON.stringify(ruleset, null, 2)
    );

    // Save example files
    const examplesDir = join(rulesetDir, 'examples');
    if (!existsSync(examplesDir)) {
      await mkdir(examplesDir, { recursive: true });
    }

    for (const [filename, content] of Object.entries(ruleset.examples)) {
      await writeFile(join(examplesDir, filename), content);
    }

    // Update Cursor config
    await this.updateCursorConfig(ruleset.name);
  }

  /**
   * Updates the main Cursor configuration to include the new ruleset
   */
  private async updateCursorConfig(rulesetName: string): Promise<void> {
    try {
      let config: CursorConfig = { rulesets: [] };

      try {
        const configContent = await readFile(this.configPath, 'utf-8');
        config = JSON.parse(configContent);
      } catch (error) {
        // Config doesn't exist yet, use default
      }

      if (!config.rulesets.includes(rulesetName)) {
        config.rulesets.push(rulesetName);
      }

      await mkdir(join(this.projectRoot, '.cursor'), { recursive: true });
      await writeFile(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      throw new Error(`Failed to update Cursor config: ${error}`);
    }
  }

  /**
   * Removes a ruleset from Cursor configuration
   */
  async removeRuleset(rulesetName: string): Promise<void> {
    const rulesetDir = join(this.rulesDir, rulesetName);
    if (existsSync(rulesetDir)) {
      await rm(rulesetDir, { recursive: true, force: true });
      await this.removeFromConfig(rulesetName);
    }
  }

  /**
   * Removes a ruleset from the Cursor config file
   */
  private async removeFromConfig(rulesetName: string): Promise<void> {
    try {
      const configContent = await readFile(this.configPath, 'utf-8');
      const config: CursorConfig = JSON.parse(configContent);

      config.rulesets = config.rulesets.filter(name => name !== rulesetName);

      await writeFile(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      // If config doesn't exist, nothing to remove
    }
  }

  async getRulesets(): Promise<string[]> {
    if (!existsSync(this.rulesDir)) {
      return [];
    }

    const entries = await readdir(this.rulesDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  }

  async getRuleset(rulesetName: string): Promise<Ruleset | null> {
    const rulesetPath = join(this.rulesDir, rulesetName, 'ruleset.json');
    if (!existsSync(rulesetPath)) {
      return null;
    }

    const content = await readFile(rulesetPath, 'utf-8');
    return JSON.parse(content) as Ruleset;
  }
} 