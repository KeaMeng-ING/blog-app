const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const commentController = {
  async createComment(req, res) {
    try {
      const { title, content } = req.body;
      const { postId } = req.params; // Get postId from request parameters
      const userId = req.authData.id; // Get userId from the token
      // Validate input
      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required",
        });
      }
      // Check if post exists
      const post = await prisma.post.findUnique({
        where: {
          id: String(postId),
        },
      });
      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }
      // Create comment
      const comment = await prisma.comment.create({
        data: {
          title,
          content,
          authorId: userId,
          postId,
        },
      });

      res.json({
        message: "Comment created",
        comment,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  async editComment(req, res) {
    try {
      const { title, content } = req.body;
      const { id } = req.params;

      // Validate input
      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required",
        });
      }

      // Check if comment exists
      const comment = await prisma.comment.findUnique({
        where: {
          id: String(id),
        },
      });
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      // Check if user is the author of the comment
      if (comment.authorId !== req.authData.id) {
        return res.status(403).json({
          message: "You are not authorized to edit this comment",
        });
      }

      // Update comment
      const updatedComment = await prisma.comment.update({
        where: {
          id: String(id),
        },
        data: {
          title,
          content,
        },
      });

      res.json({
        message: "Comment updated",
        comment: updatedComment,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  async deleteComment(req, res) {
    try {
      const { id } = req.params;

      // Check if comment exists
      const comment = await prisma.comment.findUnique({
        where: {
          id: String(id),
        },
      });
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      // Check if user is the author of the comment
      if (comment.authorId !== req.authData.id) {
        return res.status(403).json({
          message: "You are not authorized to delete this comment",
        });
      }

      // Delete comment
      await prisma.comment.delete({
        where: {
          id: String(id),
        },
      });

      res.json({
        message: "Comment deleted",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = commentController;
