#!/usr/bin/env node

import { Command } from 'commander';
import { startCommand } from './commands/start';
import { generateCommand } from './commands/generate';
import { rulesetCommand } from './commands/ruleset';

const program = new Command();

program
  .name('ddtc')
  .description('Dynamate Design-to-Code Generator')
  .version('1.0.0');

program.addCommand(startCommand);
program.addCommand(generateCommand);
program.addCommand(rulesetCommand);

program.parse(process.argv); 