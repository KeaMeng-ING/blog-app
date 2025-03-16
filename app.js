const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const port = 3000;
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
