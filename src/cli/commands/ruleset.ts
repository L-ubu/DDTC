import { Command } from 'commander';
import inquirer from 'inquirer';
import { generateRuleset, RulesetConfig } from '../../utils/ruleset-generator';
import { CursorRulesetService } from '../../services/cursor-ruleset';
import path from 'path';

export const rulesetCommand = new Command('ruleset')
  .description('Generate and manage Cursor rulesets')
  .action(async () => {
    try {
      const answers = await inquirer.prompt<RulesetConfig>([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project name?',
          validate: (input: string) => input.length > 0
        },
        {
          type: 'list',
          name: 'framework',
          message: 'Which framework are you using?',
          choices: ['react', 'vue', 'angular']
        },
        {
          type: 'list',
          name: 'styling',
          message: 'Which styling solution do you prefer?',
          choices: ['tailwind', 'css-modules', 'styled-components']
        },
        {
          type: 'list',
          name: 'componentStructure',
          message: 'How would you like to structure your components?',
          choices: ['atomic', 'feature-based', 'flat']
        }
      ]);

      const ruleset = await generateRuleset(answers);
      const service = new CursorRulesetService({
        ruleset,
        projectRoot: process.cwd(),
        cursorConfigPath: path.join(process.cwd(), '.cursor', 'config.json')
      });

      await service.applyRuleset(ruleset);
      console.log(`Successfully generated and applied ruleset: ${ruleset.name}`);
    } catch (error) {
      console.error('Failed to generate ruleset:', error);
      process.exit(1);
    }
  });

rulesetCommand
  .command('remove <name>')
  .description('Remove a ruleset')
  .action(async (name: string) => {
    try {
      const service = new CursorRulesetService({
        ruleset: { name, rules: [], examples: {} },
        projectRoot: process.cwd(),
        cursorConfigPath: path.join(process.cwd(), '.cursor', 'config.json')
      });

      await service.removeRuleset(name);
      console.log(`Successfully removed ruleset: ${name}`);
    } catch (error) {
      console.error('Failed to remove ruleset:', error);
      process.exit(1);
    }
  }); 