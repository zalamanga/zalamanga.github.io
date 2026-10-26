"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { generateApplications } = require("../data/generate-data.js");

const rows = generateApplications();
const columns = Object.keys(rows[0]);

function escapeCsv(value) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (!/[",\n]/.test(stringValue)) return stringValue;
  return `"${stringValue.replaceAll('"', '""')}"`;
}

const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(","))
].join("\n");

const outputPath = path.resolve(__dirname, "../data/kyb_applications.csv");
fs.writeFileSync(outputPath, `${csv}\n`, "utf8");
console.log(`Generated ${rows.length} synthetic KYB records at ${outputPath}`);
