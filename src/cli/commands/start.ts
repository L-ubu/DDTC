import { Command } from 'commander';
import inquirer from 'inquirer';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ensureDir } from '../../utils';
import dotenv from 'dotenv';

export const startCommand = new Command('start')
  .description('Initialize and configure the Dynamate Design-to-Code tool')
  .action(async () => {
    console.log('🚀 Welcome to Dynamate Design-to-Code Generator!');
    console.log('Let\'s set up your environment...\n');

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'figmaToken',
        message: 'Enter your Figma access token (from Figma settings):',
        validate: (input) => input.length > 0 || 'Figma token is required'
      },
      {
        type: 'confirm',
        name: 'useOpenAI',
        message: 'Would you like to use OpenAI for enhanced code generation?',
        default: true
      },
      {
        type: 'input',
        name: 'openaiToken',
        message: 'Enter your OpenAI API key:',
        when: (answers) => answers.useOpenAI,
        validate: (input) => input.length > 0 || 'OpenAI API key is required'
      },
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
        when: (answers) => answers.framework === 'custom',
        validate: (input) => input.length > 0 || 'Custom framework name is required'
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
        when: (answers) => answers.styling === 'custom',
        validate: (input) => input.length > 0 || 'Custom styling solution is required'
      }
    ]);

    // Create .env file
    const envContent = `FIGMA_ACCESS_TOKEN=${answers.figmaToken}
${answers.useOpenAI ? `OPENAI_API_KEY=${answers.openaiToken}` : ''}`;

    writeFileSync('.env', envContent);
    console.log('✅ Created .env file with access tokens');

    // Create config file
    const configContent = {
      generator: {
        framework: answers.framework === 'custom' ? answers.customFramework : answers.framework,
        styling: answers.styling === 'custom' ? answers.customStyling : answers.styling,
        features: {
          typescript: true,
          storybook: true,
          tests: true,
          accessibility: true
        }
      }
    };

    writeFileSync('.dynamaterc.json', JSON.stringify(configContent, null, 2));
    console.log('✅ Created configuration file');

    // Setup Figma MCP instructions
    console.log('\n📋 To complete setup:');
    console.log('1. Install Bun if you haven\'t already:');
    console.log('   curl -fsSL https://bun.sh/install | bash');
    console.log('\n2. Add the MCP server to your Cursor configuration:');
    console.log('   Create or edit ~/.cursor/mcp.json with:');
    console.log('   {');
    console.log('     "mcpServers": {');
    console.log('       "TalkToFigma": {');
    console.log('         "command": "bunx",');
    console.log('         "args": ["cursor-talk-to-figma-mcp@latest"]');
    console.log('       }');
    console.log('     }');
    console.log('   }');
    console.log('\n3. Start the WebSocket server:');
    console.log('   bun socket');
    console.log('\n4. Install the Figma plugin from:');
    console.log('   https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp');
    console.log('\n5. In Figma:');
    console.log('   - Run the Cursor MCP Plugin');
    console.log('   - Connect the plugin using join_channel');
    
    console.log('\n🎉 Setup complete! You can now use:');
    console.log('- ddtc generate [figma-section-link] : Generate code from a Figma section');
    console.log('- ddtc ruleset : Create and manage rulesets');
  }); 