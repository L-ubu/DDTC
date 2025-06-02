import { Command } from 'commander';
import inquirer from 'inquirer';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ensureDir } from '../../utils';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

interface SetupAnswers {
  figmaToken: string;
  framework: 'react' | 'vue' | 'svelte' | 'solid' | 'angular' | 'custom';
  customFramework?: string;
  styling: 'tailwind' | 'css-modules' | 'styled-components' | 'scss' | 'custom';
  customStyling?: string;
  startMcp: boolean;
}

export const startCommand = new Command('start')
  .description('Initialize and configure the Dynamate Design-to-Code tool')
  .action(async () => {
    console.log('🚀 Welcome to Dynamate Design-to-Code Generator!');
    console.log('Let\'s set up your Figma MCP integration...\n');

    const answers = await inquirer.prompt<SetupAnswers>([
      {
        type: 'input',
        name: 'figmaToken',
        message: 'Enter your Figma access token (from Figma settings):',
        validate: (input: string): boolean | string => input.length > 0 || 'Figma token is required'
      }
    ]);

    // Save the token to .env
    const envContent = `FIGMA_ACCESS_TOKEN=${answers.figmaToken}`;
    writeFileSync('.env', envContent);
    console.log('✅ Saved Figma access token\n');

    // Explain MCP setup
    console.log('📡 Now let\'s set up the Figma MCP connection in Cursor:');
    console.log('\n1. Open Cursor\'s settings');
    console.log('2. Go to the Features tab');
    console.log('3. Find the "Model Context Protocol (MCP)" section');
    console.log('4. Add http://localhost:3333 as an MCP server');
    console.log('5. Click Save\n');

    console.log('Press Enter when you\'ve completed these steps...');
    await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);

    // Ask to start MCP server
    const { startMcp } = await inquirer.prompt<{ startMcp: boolean }>([
      {
        type: 'confirm',
        name: 'startMcp',
        message: 'Would you like to start the Figma MCP server now?',
        default: true
      }
    ]);

    if (startMcp) {
      console.log('\n🚀 Starting Figma MCP server...');
      const mcpProcess = spawn('npx', ['figma-developer-mcp', `--figma-api-key=${answers.figmaToken}`], {
        stdio: 'inherit'
      });

      process.on('SIGINT', () => {
        mcpProcess.kill();
        process.exit();
      });

      console.log('\n✨ Figma MCP server is running!');
    } else {
      console.log('\nYou can start the MCP server later with:');
      console.log(`npx figma-developer-mcp --figma-api-key=${answers.figmaToken}`);
    }

    // Framework and styling setup
    console.log('\n🛠️ Let\'s configure your development preferences...\n');
    
    const devAnswers = await inquirer.prompt<Omit<SetupAnswers, 'figmaToken' | 'startMcp'>>([
      {
        type: 'list',
        name: 'framework',
        message: 'Which framework would you like to use?',
        choices: ['react', 'vue', 'svelte', 'solid', 'angular', 'custom'],
        default: 'react'
      },
      {
        type: 'input',
        name: 'customFramework',
        message: 'Enter your custom framework name:',
        when: (answers: SetupAnswers): boolean => answers.framework === 'custom',
        validate: (input: string): boolean | string => input.length > 0 || 'Custom framework name is required'
      },
      {
        type: 'list',
        name: 'styling',
        message: 'Which styling solution would you like to use?',
        choices: ['tailwind', 'css-modules', 'styled-components', 'scss', 'custom'],
        default: 'tailwind'
      },
      {
        type: 'input',
        name: 'customStyling',
        message: 'Enter your custom styling solution:',
        when: (answers: SetupAnswers): boolean => answers.styling === 'custom',
        validate: (input: string): boolean | string => input.length > 0 || 'Custom styling solution is required'
      }
    ]);

    // Create config file
    const configContent = {
      generator: {
        framework: devAnswers.framework === 'custom' ? devAnswers.customFramework : devAnswers.framework,
        styling: devAnswers.styling === 'custom' ? devAnswers.customStyling : devAnswers.styling,
        features: {
          typescript: true,
          storybook: true,
          tests: true,
          accessibility: true
        }
      }
    };

    writeFileSync('.dynamaterc.json', JSON.stringify(configContent, null, 2));
    console.log('\n✅ Created configuration file');

    // Final instructions
    console.log('\n🎉 Setup complete! Here\'s how to use the tool:');
    console.log('\n1. Using with Cursor Composer:');
    console.log('   - Open Cursor\'s composer in agent mode');
    console.log('   - Paste a Figma file/frame/component link');
    console.log('   - Ask Cursor to implement the design');

    console.log('\n2. Using Command Line:');
    console.log('   - Generate code: ddtc generate [figma-link]');
    console.log('   - Create ruleset: ddtc ruleset');

    console.log('\n3. Managing Rulesets:');
    console.log('   Option 1: Via Cursor Settings');
    console.log('   - Go to Cursor settings');
    console.log('   - Navigate to the Features tab');
    console.log('   - Add your ruleset in the Rulesets section');
    
    console.log('\n   Option 2: Via Command Line');
    console.log('   - List rulesets: ddtc ruleset list');
    console.log('   - Apply ruleset: ddtc ruleset apply');
    console.log('   - Remove ruleset: ddtc ruleset remove');

    if (startMcp) {
      console.log('\n⚠️ The MCP server is running in this terminal.');
      console.log('   Press Ctrl+C to stop it when you\'re done.');
    }
  }); 