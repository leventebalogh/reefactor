const fs = require("fs");
const path = require("path");
const { command } = require("../lib/bash");
const { getFileStats } = require("./file-stats");

module.exports = { getMostFrequentlyModifiedFiles, isGitDirectory };

const MAX_NUMBER_OF_FILES = 40;
const MIN_NUMBER_OF_LINES = 80;
const MIN_NUMBER_OF_INDENTATION = 3;
const ENABLED_FILE_EXTENSIONS = [".js", ".css", ".scss"];

async function isGitDirectory(directory) {
  const bashCommand = "git rev-parse --is-inside-work-tree 2>&1";
  const stdout = await command(bashCommand);

  return stdout.trim() === "true";
}

async function getMostFrequentlyModifiedFiles(basePath) {
  const stdout = await getGitHistoryOfFiles(basePath);
  const files = getLines(stdout)
    .map(line => transformLine(basePath, line))
    .filter(doesFileHaveFileName)
    .filter(isFileEnabled)
    .filter(doesFileExist)
    .map(extendFileStats)
    .filter(doesHaveMinimumNumberOfLines)
    .filter(doesHaveMinimumLevelOfNesting);

  return files;
}

function getGitHistoryOfFiles(basePath) {
  const bashCommand = `
    cd ${basePath} &&
    git log --pretty=format: --name-only |
    sort |
    uniq -c |
    sort -rg |
    head -${MAX_NUMBER_OF_FILES}`;

  return command(bashCommand);
}

function getLines(stdout) {
  return stdout.split("\n");
}

function transformLine(basePath, line) {
  const [numberOfModifications, fileName] = line.trim().split(" ");
  const fullPath = path.join(basePath, fileName || "");

  return {
    numberOfModifications,
    fileName,
    fullPath
  };
}

function isFileEnabled(file) {
  return ENABLED_FILE_EXTENSIONS.includes(path.extname(file.fileName));
}

function doesFileHaveFileName(file) {
  return Boolean(file.fileName);
}

function doesFileExist(file) {
  return fs.existsSync(file.fullPath);
}

function extendFileStats(file) {
  return {
    ...file,
    ...getFileStats(file.fullPath)
  };
}

function doesHaveMinimumNumberOfLines(file) {
  return file.numberOfLines >= MIN_NUMBER_OF_LINES;
}

function doesHaveMinimumLevelOfNesting(file) {
  return file.maxIndentation >= MIN_NUMBER_OF_INDENTATION;
}
