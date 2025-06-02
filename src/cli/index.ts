#!/usr/bin/env node

import { Command } from 'commander';
import { startCommand } from './commands/start';
import { generateCommand } from './commands/generate';
import { rulesetCommand } from './commands/ruleset';

const program = new Command();

program
  .name('ddtc')
  .description('Dynamate Design-to-Code Generator CLI')
  .version('1.0.1');

program.addCommand(startCommand);
program.addCommand(generateCommand);
program.addCommand(rulesetCommand);

program.parse(process.argv); 