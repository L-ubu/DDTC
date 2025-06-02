import { Command } from 'commander';
import inquirer from 'inquirer';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ensureDir } from '../../utils';
import dotenv from 'dotenv';

interface SetupAnswers {
  figmaToken: string;
  useOpenAI: boolean;
  openaiToken?: string;
  framework: 'react' | 'vue' | 'svelte' | 'solid' | 'angular' | 'custom';
  customFramework?: string;
  styling: 'tailwind' | 'css-modules' | 'styled-components' | 'scss' | 'custom';
  customStyling?: string;
}

export const startCommand = new Command('start')
  .description('Initialize and configure the Dynamate Design-to-Code tool')
  .action(async () => {
    console.log('🚀 Welcome to Dynamate Design-to-Code Generator!');
    console.log('Let\'s set up your environment...\n');

    const answers = await inquirer.prompt<SetupAnswers>([
      {
        type: 'input',
        name: 'figmaToken',
        message: 'Enter your Figma access token (from Figma settings):',
        validate: (input: string): boolean | string => input.length > 0 || 'Figma token is required'
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
        when: (answers: SetupAnswers): boolean => answers.useOpenAI,
        validate: (input: string): boolean | string => input.length > 0 || 'OpenAI API key is required'
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
    console.log('\n📡 Setup Figma MCP Server');
    console.log('\nWhat and How?');
    console.log('Give Cursor access to your Figma files with this Model Context Protocol server.');
    console.log('When Cursor has access to Figma design data, it\'s way better at one-shotting designs');
    console.log('accurately than alternative approaches like pasting screenshots.\n');

    console.log('How it works:');
    console.log('1. Open Cursor\'s composer in agent mode');
    console.log('2. Paste a link to a Figma file, frame, or group');
    console.log('3. Ask Cursor to do something with the Figma file—e.g. implement a design');
    console.log('4. Cursor will fetch the relevant metadata from Figma and use it to write your code\n');

    console.log('Installation Options:');
    console.log('\nOPTION 1: Running the server quickly with NPM');
    console.log('npx figma-developer-mcp --figma-api-key=<your-figma-api-key>');
    console.log('# or');
    console.log('pnpx figma-developer-mcp --figma-api-key=<your-figma-api-key>');
    console.log('# or');
    console.log('yarn dlx figma-developer-mcp --figma-api-key=<your-figma-api-key>');
    console.log('# or');
    console.log('bunx figma-developer-mcp --figma-api-key=<your-figma-api-key>\n');

    console.log('OPTION 2: Running the server from local source');
    console.log('1. Clone the repository');
    console.log('2. Install dependencies with pnpm install');
    console.log('3. Copy .env.example to .env and fill in your Figma API access token');
    console.log('4. Run the server with pnpm run dev\n');

    console.log('Configuration:');
    console.log('The server can be configured using either environment variables (via .env file)');
    console.log('or command-line arguments. Command-line arguments take precedence.\n');

    console.log('Environment Variables:');
    console.log('- FIGMA_API_KEY: Your Figma API access token (required)');
    console.log('- PORT: The port to run the server on (default: 3333)\n');

    console.log('Command-line Arguments:');
    console.log('- -version: Show version number');
    console.log('- -figma-api-key: Your Figma API access token');
    console.log('- -port: The port to run the server on');
    console.log('- -stdio: Run the server in command mode, instead of default HTTP/SSE');
    console.log('- -help: Show help menu\n');

    console.log('Start the server:');
    console.log('> npx figma-developer-mcp --figma-api-key=<your-figma-api-key>');
    console.log('# Initializing Figma MCP Server in HTTP mode on port 3333...');
    console.log('# HTTP server listening on port 3333');
    console.log('# SSE endpoint available at http://localhost:3333/sse');
    console.log('# Message endpoint available at http://localhost:3333/messages\n');

    console.log('Connect Cursor to the MCP server:');
    console.log('1. Open Cursor\'s settings under the features tab');
    console.log('2. Connect to the MCP server');
    console.log('3. Verify the connection - you should see a green dot and tools appear\n');

    console.log('Start using Composer with your Figma designs:');
    console.log('- Use the composer in agent mode');
    console.log('- Drop a Figma file link and ask Cursor to work with it');
    console.log('- For specific elements, use CMD + L to copy the element link');
    console.log('- Or find the link in the context menu\n');

    console.log('🎉 You can now use:');
    console.log('- ddtc generate [figma-section-link] : Generate code from a Figma section');
    console.log('- ddtc ruleset : Create and manage rulesets');
  }); 