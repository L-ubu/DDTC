import { Command } from 'commander';
import inquirer from 'inquirer';
import { generateRuleset, RulesetConfig } from '../../utils/ruleset-generator';
import { CursorRulesetService } from '../../services/cursor-ruleset';
import path from 'path';

const frameworks = ['react', 'vue', 'angular', 'next', 'nuxt', 'svelte', 'solid', 'astro', 'remix', 'custom'];
const stylingOptions = ['tailwind', 'css-modules', 'styled-components', 'scss', 'emotion', 'stitches', 'vanilla-extract', 'custom'];
const structureOptions = ['atomic', 'feature-based', 'flat', 'custom'];

export const rulesetCommand = new Command('ruleset')
  .description('Generate and manage Cursor rulesets')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
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
          choices: frameworks
        },
        {
          type: 'input',
          name: 'customFramework',
          message: 'Enter your custom framework:',
          when: (answers) => answers.framework === 'custom',
          validate: (input: string) => input.length > 0
        },
        {
          type: 'list',
          name: 'styling',
          message: 'Which styling solution do you prefer?',
          choices: stylingOptions
        },
        {
          type: 'input',
          name: 'customStyling',
          message: 'Enter your custom styling solution:',
          when: (answers) => answers.styling === 'custom',
          validate: (input: string) => input.length > 0
        },
        {
          type: 'list',
          name: 'componentStructure',
          message: 'How would you like to structure your components?',
          choices: structureOptions
        },
        {
          type: 'input',
          name: 'customStructure',
          message: 'Enter your custom component structure:',
          when: (answers) => answers.componentStructure === 'custom',
          validate: (input: string) => input.length > 0
        }
      ]);

      // Add default empty conventions if not provided
      const config: RulesetConfig = {
        ...answers,
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

      const ruleset = await generateRuleset(config);
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