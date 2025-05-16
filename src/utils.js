const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
require("dayjs/locale/fr");
dayjs.locale("fr");

const filePath = path.join(__dirname, "..", "Data", "students.json");

function readStudents() {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function writeStudents(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function formatDateFR(dateStr) {
  return dayjs(dateStr).format("DD MMMM YYYY");
}

module.exports = {
  readStudents,
  writeStudents,
  formatDateFR,
};
