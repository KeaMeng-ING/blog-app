// routes/userRoutes.js

const express = require("express");
const app = express();
const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");

app.post("/login", userController.logIn);
app.post("/signup", userController.signUp);
app.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = app;
