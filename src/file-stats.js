const fs = require("fs");
const readline = require("readline");

module.exports = {
  getFileStats,
  getMaxIndentation,
  getNumberOfLines
};

function getFileStats(file) {
  return {
    maxIndentation: getMaxIndentation(file),
    numberOfLines: getNumberOfLines(file)
  };
}

function getNumberOfLines(file) {
  return getLinesOfFile(file).length;
}

function getMaxIndentation(file) {
  const lines = getLinesOfFile(file);
  const maxNumberOfLeadingSpaces = getMaxNumberOfLeadingSpaces(lines);
  const maxIndentation = convertNumberOfSpacesToIndentation(
    maxNumberOfLeadingSpaces
  );

  return maxIndentation;
}

function getLinesOfFile(file) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");

  return lines;
}

function convertNumberOfSpacesToIndentation(numberOfSpaces) {
  return Math.ceil(numberOfSpaces / 4);
}

function getMaxNumberOfLeadingSpaces(lines) {
  return lines.reduce(
    (maxIndentation, line) =>
      Math.max(getNumberOfLeadingSpaces(line), maxIndentation),
    0
  );
}

function getNumberOfLeadingSpaces(str) {
  return str.search(/\S|$/);
}
