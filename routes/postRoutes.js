const express = require("express");
const app = express();
const postController = require("../controllers/postController");
const verifyToken = require("../middleware/verifyToken");

app.post("/create", verifyToken, postController.createPost);
app.post("/edit/:id", verifyToken, postController.editPost);
app.post("/delete/:id", verifyToken, postController.deletePost);
app.get("/", verifyToken, postController.getAllPosts);
app.post("/createCategory", verifyToken, postController.createCategory);

module.exports = app;
