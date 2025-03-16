const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const authMiddleware = require("../middleware/auth");

app.post("/login", (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: "brad",
    email: "brad@gmail.com",
  };

  jwt.sign({ user }, "secretKey", (err, token) => {
    res.json({
      token,
    });
  });
});

app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(firstName);
  res.json({
    message: "Signup successful",
  });
});

app.get("/me", authMiddleware, (req, res) => {
  console.log(object);
  console.log(object);
  res.json({ user: req.user });
});

module.exports = app;
