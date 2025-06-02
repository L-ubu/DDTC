import { Command } from 'commander';
import inquirer from 'inquirer';
import { generateRuleset } from '../../utils/ruleset-generator';
import { CursorRulesetService } from '../../services/cursor-ruleset';
import type { RulesetConfig } from '../../utils/ruleset-generator';

export const rulesetCommand = new Command('ruleset')
  .description('Manage code generation rulesets')
  .action(async () => {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['create', 'apply', 'remove', 'list']
      }
    ]);

    switch (action) {
      case 'create':
        await createRuleset();
        break;
      case 'apply':
        await applyRuleset();
        break;
      case 'remove':
        await removeRuleset();
        break;
      case 'list':
        await listRulesets();
        break;
    }
  });

async function createRuleset() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:'
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Framework:',
      choices: ['react', 'vue', 'angular', 'next', 'nuxt', 'svelte', 'solid', 'astro']
    },
    {
      type: 'list',
      name: 'styling',
      message: 'Styling solution:',
      choices: ['tailwind', 'css-modules', 'styled-components', 'scss']
    },
    {
      type: 'list',
      name: 'componentStructure',
      message: 'Component structure:',
      choices: ['atomic', 'feature-based', 'flat']
    },
    {
      type: 'checkbox',
      name: 'conventions',
      message: 'Select conventions to enforce:',
      choices: [
        { name: 'Component naming', value: 'components' },
        { name: 'Props naming', value: 'props' },
        { name: 'Style naming', value: 'styles' },
        { name: 'Import structure', value: 'imports' },
        { name: 'Export structure', value: 'exports' },
        { name: 'Type definitions', value: 'types' },
        { name: 'JSDoc comments', value: 'jsdoc' },
        { name: 'README files', value: 'readme' },
        { name: 'Example code', value: 'examples' }
      ]
    }
  ]);

  const conventions = answers.conventions.reduce((acc: { 
    naming?: { [key: string]: boolean };
    structure?: { [key: string]: boolean };
    documentation?: { [key: string]: boolean };
  }, conv: string) => {
    if (['components', 'props', 'styles'].includes(conv)) {
      acc.naming = acc.naming || {};
      acc.naming[conv] = true;
    } else if (['imports', 'exports', 'types'].includes(conv)) {
      acc.structure = acc.structure || {};
      acc.structure[conv] = true;
    } else if (['jsdoc', 'readme', 'examples'].includes(conv)) {
      acc.documentation = acc.documentation || {};
      acc.documentation[conv] = true;
    }
    return acc;
  }, {});

  const config: RulesetConfig = {
    projectName: answers.projectName,
    framework: answers.framework,
    styling: answers.styling,
    componentStructure: answers.componentStructure,
    projectRoot: process.cwd(),
    conventions
  };

  try {
    const ruleset = await generateRuleset(config);
    const service = new CursorRulesetService({ 
      ruleset,
      projectRoot: process.cwd() 
    });
    await service.applyRuleset(ruleset);
    console.log('✨ Ruleset created and applied successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message);
    } else {
      console.error('❌ An unknown error occurred');
    }
    process.exit(1);
  }
}

async function listRulesets() {
  try {
    const service = new CursorRulesetService({ 
      ruleset: { name: '', rules: [], examples: {} },
      projectRoot: process.cwd() 
    });
    const rulesets = await service.getRulesets();
    
    if (rulesets.length === 0) {
      console.log('No rulesets found.');
      return;
    }

    console.log('\nAvailable rulesets:');
    rulesets.forEach(ruleset => {
      console.log(`- ${ruleset}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message);
    } else {
      console.error('❌ An unknown error occurred');
    }
    process.exit(1);
  }
}

async function applyRuleset() {
  try {
    const service = new CursorRulesetService({ 
      ruleset: { name: '', rules: [], examples: {} },
      projectRoot: process.cwd() 
    });
    const rulesets = await service.getRulesets();

    if (rulesets.length === 0) {
      console.log('No rulesets available. Create a ruleset first.');
      return;
    }

    const { selectedRuleset } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedRuleset',
        message: 'Select a ruleset to apply:',
        choices: rulesets
      }
    ]);

    await service.applyRuleset({ name: selectedRuleset, rules: [], examples: {} });
    console.log(`✨ Ruleset "${selectedRuleset}" applied successfully!`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message);
    } else {
      console.error('❌ An unknown error occurred');
    }
    process.exit(1);
  }
}

async function removeRuleset() {
  try {
    const service = new CursorRulesetService({ 
      ruleset: { name: '', rules: [], examples: {} },
      projectRoot: process.cwd() 
    });
    const rulesets = await service.getRulesets();

    if (rulesets.length === 0) {
      console.log('No rulesets available to remove.');
      return;
    }

    const { selectedRuleset } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedRuleset',
        message: 'Select a ruleset to remove:',
        choices: rulesets
      }
    ]);

    await service.removeRuleset(selectedRuleset);
    console.log(`✨ Ruleset "${selectedRuleset}" removed successfully!`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message);
    } else {
      console.error('❌ An unknown error occurred');
    }
    process.exit(1);
  }
} 