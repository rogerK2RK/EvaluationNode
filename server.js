require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const {
  readStudents,
  writeStudents,
  formatDateFR,
} = require("./src/utils");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));

app.use(express.static(path.join(__dirname, "assets")));
app.use(bodyParser.urlencoded({ extended: true }));

// Route Accueil (formulaire)
app.get("/", (req, res) => {
  res.render("home");
});

// Route Affichage
app.get("/users", (req, res) => {
  const students = readStudents().map((s) => ({
    ...s,
    birthFormatted: formatDateFR(s.birth),
  }));
  res.render("users", { students });
});

// Route POST ajout
app.post("/add", (req, res) => {
  const { name, birth } = req.body;
  const students = readStudents();
  students.push({ name, birth });
  writeStudents(students);
  res.redirect("/users");
});

// Route POST suppression
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const students = readStudents();
  students.splice(id, 1);
  writeStudents(students);
  res.redirect("/users");
});

// Lancement serveur
const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || "localhost";

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé : http://${HOST}:${PORT}`);
});
