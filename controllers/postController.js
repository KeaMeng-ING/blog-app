const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const postController = {
  async createPost(req, res) {
    try {
      jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
          res.sendStatus(403);
        }

        const { title, content } = req.body;
        if (!title || !content) {
          return res.status(400).json({
            message: "Title and content are required",
          });
        }
        const newPost = await prisma.post.create({
          data: {
            title,
            content,
            authorId: authData.id,
            isPublished: true,
          },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
              },
            },
          },
        });

        res.json({
          message: "Post created",
          post: newPost,
        });
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async editPost(req, res) {
    try {
      jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
          res.sendStatus(403);
        }

        const { title, content } = req.body;
        const { id } = req.params;

        const post = await prisma.post.findUnique({
          where: {
            id: String(id),
          },
        });
        if (!post) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        if (post.authorId !== authData.id) {
          return res.status(403).json({
            message: "You are not authorized to edit this post",
          });
        }

        const updatedPost = await prisma.post.update({
          where: {
            id: String(id),
          },
          data: {
            title,
            content,
          },
        });

        res.json({
          message: "Post updated",
          post: updatedPost,
        });
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async deletePost(req, res) {
    try {
      jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
        if (err) {
          return res.sendStatus(403);
        }

        const { id } = req.params;

        const deletePost = await prisma.post.delete({
          where: {
            id: String(id),
          },
        });
        if (!deletePost) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        if (deletePost.authorId !== authData.id) {
          return res.status(403).json({
            message: "You are not authorized to delete this post",
          });
        }

        res.json({
          message: "working",
        });
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = postController;
