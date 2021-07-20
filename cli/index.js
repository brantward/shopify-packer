#!/usr/bin/env node

const minimist = require('minimist');
const args = minimist(process.argv.slice(2));

switch (process.argv[2]) {
  case 'start':
    require('./commands/start')(args);
    break;
  case 'build':
    require('./commands/build')(args);
    break;
}
