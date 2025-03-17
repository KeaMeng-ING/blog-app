const express = require("express");
const app = express();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middleware/verifyToken");

app.post("/create/:postId", verifyToken, commentController.createComment);
app.put("/edit/:id", verifyToken, commentController.editComment);
app.delete("/delete/:id", verifyToken, commentController.deleteComment);

module.exports = app;
