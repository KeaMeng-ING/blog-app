const express = require("express");
const app = express();
const postController = require("../controllers/postController");

app.post("/", verifyToken, postController.createPost);
app.post("/edit/:id", verifyToken, postController.editPost);
app.post("/delete/:id", verifyToken, postController.deletePost);

module.exports = app;

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearerHeader is undefined
  if (typeof bearerHeader !== "undefined") {
    // split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
