#!/usr/bin/env node

const path = require("path");
const { visualise } = require("../src/visalisation");
const {
  getMostFrequentlyModifiedFiles,
  isGitDirectory
} = require("../src/git-stats");

run();

async function run() {
  const cwd = process.cwd();
  const isInsideGitDirectory = await isGitDirectory(cwd);

  if (!isInsideGitDirectory) {
    console.log("You must be inside a Git directory to use this utility.");
    exit(1);
  }

  await visualiseStats();
}

async function visualiseStats() {
  const cwd = process.cwd();
  const stats = await getMostFrequentlyModifiedFiles(cwd);

  visualise(stats);
}
