import { Command } from 'commander';
import inquirer from 'inquirer';
import { RulesetGenerator } from '../../core/ruleset-generator';
import { CursorRulesetService } from '../../services/cursor-ruleset';
import { join } from 'path';

export const rulesetCommand = new Command('ruleset')
  .description('Create and manage rulesets')
  .action(async () => {
    const action = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['create', 'apply', 'remove']
      }
    ]);

    if (action.action === 'create') {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter a name for your ruleset:',
          validate: (input) => input.length > 0 || 'Name is required'
        },
        {
          type: 'list',
          name: 'framework',
          message: 'Which framework are you using?',
          choices: ['react', 'vue', 'svelte', 'solid', 'angular', 'astro'],
          default: 'react'
        },
        {
          type: 'list',
          name: 'styling',
          message: 'Which styling solution are you using?',
          choices: ['tailwind', 'css-modules', 'styled-components', 'scss'],
          default: 'tailwind'
        },
        {
          type: 'list',
          name: 'componentStructure',
          message: 'How would you like to structure your components?',
          choices: ['atomic', 'feature-based', 'flat'],
          default: 'atomic'
        },
        {
          type: 'checkbox',
          name: 'conventions',
          message: 'Select the conventions you want to enforce:',
          choices: [
            { name: 'Component naming', value: 'naming.components', checked: true },
            { name: 'Props naming', value: 'naming.props', checked: true },
            { name: 'Style naming', value: 'naming.styles', checked: true },
            { name: 'Import structure', value: 'structure.imports', checked: true },
            { name: 'Export structure', value: 'structure.exports', checked: true },
            { name: 'Type definitions', value: 'structure.types', checked: true },
            { name: 'JSDoc documentation', value: 'documentation.jsdoc', checked: true },
            { name: 'README files', value: 'documentation.readme', checked: true },
            { name: 'Code examples', value: 'documentation.examples', checked: true }
          ]
        }
      ]);

      // Convert conventions array to object structure
      const conventions = answers.conventions.reduce((acc, conv) => {
        const [category, type] = conv.split('.');
        if (!acc[category]) acc[category] = {};
        acc[category][type] = true;
        return acc;
      }, {});

      const generator = new RulesetGenerator({
        projectName: answers.name,
        framework: answers.framework,
        styling: answers.styling,
        componentStructure: answers.componentStructure,
        projectRoot: process.cwd(),
        conventions
      });

      console.log('📝 Generating ruleset...');
      const ruleset = await generator.generateRuleset();

      const service = new CursorRulesetService({
        ruleset,
        projectRoot: process.cwd()
      });

      console.log('💾 Saving ruleset...');
      await service.applyRuleset(ruleset);

      console.log('\n✨ Ruleset created successfully!');
      console.log(`📁 Ruleset saved as: ${answers.name}`);

    } else if (action.action === 'apply') {
      // Get list of available rulesets
      const service = new CursorRulesetService({
        projectRoot: process.cwd()
      });

      const rulesets = await service.listRulesets();
      
      if (rulesets.length === 0) {
        console.log('❌ No rulesets found. Create one first using: ddtc ruleset create');
        return;
      }

      const { ruleset } = await inquirer.prompt([
        {
          type: 'list',
          name: 'ruleset',
          message: 'Select a ruleset to apply:',
          choices: rulesets
        }
      ]);

      console.log(`🔄 Applying ruleset: ${ruleset}...`);
      await service.applyRuleset(ruleset);
      console.log('✅ Ruleset applied successfully!');

    } else if (action.action === 'remove') {
      const service = new CursorRulesetService({
        projectRoot: process.cwd()
      });

      const rulesets = await service.listRulesets();
      
      if (rulesets.length === 0) {
        console.log('❌ No rulesets found.');
        return;
      }

      const { ruleset } = await inquirer.prompt([
        {
          type: 'list',
          name: 'ruleset',
          message: 'Select a ruleset to remove:',
          choices: rulesets
        }
      ]);

      console.log(`🗑️ Removing ruleset: ${ruleset}...`);
      await service.removeRuleset(ruleset);
      console.log('✅ Ruleset removed successfully!');
    }
  }); 