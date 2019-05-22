/* eslint-disable no-console */

import chalk from 'chalk';
import moment from 'moment';

const { log } = console;
const tag = status => `[${status.padEnd(8)} - ${moment().format('DD/MMM/YYYY hh:mm:ss')}]:`;

/**
 * Logger middleware, you can customize it to make messages more personal
 */
const logger = {
  // Called whenever there's an error on the server we want to print
  log,
  note(...msg) {
    log(chalk.white(tag('NOTE'), msg));
  },
  info(...msg) {
    log(chalk.cyan(tag('INFO'), msg));
  },
  success(...msg) {
    log(chalk.green(tag('SUCCESS'), msg));
  },
  warning(...msg) {
    log(chalk.yellow(tag('WARNING'), msg));
  },
  error(...msg) {
    log(chalk.red(tag('ERROR'), msg));
  },
};

export default logger;
