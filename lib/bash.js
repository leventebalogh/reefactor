const { exec } = require("child_process");
const Promise = require("bluebird");
const chalk = require("chalk");
const fs = require("fs");
const rimraf = require("rimraf");

module.exports = {
  command,
  logInfo,
  logError,
  logSuccess,
  exit,
  removeFolder
};

function command(command) {
  return new Promise((resolve, reject) => {
    const p = exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });

    // p.stdout.pipe(process.stdout);
    // p.stderr.pipe(process.stderr);
  });
}

function exit(code = 0) {
  process.exit(code);
}

function logSuccess(msg, ...rest) {
  console.log(chalk.green(`success: ${msg}`, ...rest));
}

function logError(msg, ...rest) {
  console.log(chalk.red(`error: ${msg}`, ...rest));
}

function logInfo(msg, ...rest) {
  console.log(`info: ${msg}`, ...rest);
}

function removeFolder(folder) {
  if (fs.existsSync(folder)) {
    rimraf.sync(folder);
  }
}
