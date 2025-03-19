const express = require("express");
const app = express();
const port = 3000;
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const cors = require("cors"); // Import CORS

app.use(cors()); // Enable CORS
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello Worldd",
  });
});
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port https://localhost:${port}`);
});
