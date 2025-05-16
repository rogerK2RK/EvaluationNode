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

// Chargement des variables d'environnement
const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || "localhost";

// View engine Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));

// Middlewares
app.use(express.static(path.join(__dirname, "assets")));
app.use(bodyParser.urlencoded({ extended: true }));

// Menu principal (pour la navigation)
const menuItems = [
  { path: "/", title: "Home" },
  { path: "/users", title: "Users" },
];

// Page d'accueil : formulaire d'ajout
app.get("/", (req, res) => {
  res.render("home", {
    toast: req.query.toast || null,
    menuItems: menuItems.map(item => ({
      ...item,
      isActive: item.path === "/"
    }))
  });
});

// POST : ajout d'un étudiant
app.post("/add", (req, res) => {
  const { name, birth } = req.body;
  const students = readStudents();
  students.push({ name, birth });
  writeStudents(students);
  res.redirect("/users?toast=Étudiant ajouté");
});

// Page utilisateurs : liste + boutons modifier / supprimer
app.get("/users", (req, res) => {
  const students = readStudents().map((s) => ({
    ...s,
    birthFormatted: formatDateFR(s.birth),
  }));

  res.render("users", {
    students,
    toast: req.query.toast || null,
    menuItems: menuItems.map(item => ({
      ...item,
      isActive: item.path === "/users"
    }))
  });
});

// Suppression
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const students = readStudents();
  if (!students[id]) return res.redirect("/users?toast=Étudiant introuvable");

  students.splice(id, 1);
  writeStudents(students);
  res.redirect("/users?toast=Étudiant supprimé");
});

// Modification : formulaire prérempli
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const students = readStudents();
  const student = students[id];

  if (!student) return res.redirect("/users?toast=Étudiant introuvable");

  res.render("edit", {
    id,
    student,
    toast: req.query.toast || null,
    menuItems: menuItems.map(item => ({
      ...item,
      isActive: false
    }))
  });
});

// POST : modification d'un étudiant
app.post("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, birth } = req.body;

  const students = readStudents();
  if (!students[id]) return res.redirect("/users?toast=Étudiant introuvable");

  students[id] = { name, birth };
  writeStudents(students);
  res.redirect("/users?toast=Modification réussie");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur en ligne sur http://${HOST}:${PORT}`);
});
