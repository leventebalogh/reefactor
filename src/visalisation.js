const Table = require("cli-table");

module.exports = {
  visualise
};

function visualise(stats) {
  const table = getTable(stats);

  console.log(table.toString());
}

function getTable(stats) {
  const table = new Table({
    head: [
      "File name",
      "No. of modifications",
      "Level of nesting",
      "No. of lines"
    ],
    colWidths: [100, 20, 20, 20]
  });

  table.push(...transformStatsToTableArgs(stats));

  return table;
}

function transformStatsToTableArgs(stats) {
  return stats.map(stat => [
    stat.fileName,
    stat.numberOfModifications,
    stat.maxIndentation,
    stat.numberOfLines
  ]);
}
