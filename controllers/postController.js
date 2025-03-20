const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const postController = {
  async createPost(req, res) {
    try {
      const {
        title,
        content,
        imageUrl,
        imageAlt,
        excerpt,
        subtitle,
        categoryId,
        readTime,
      } = req.body;
      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required",
        });
      }
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          authorId: req.authData.id,
          isPublished: true,
          imageUrl, // We should have default
          imageAlt,
          excerpt,
          subtitle,
          categoryId,
          readTime,
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
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  async editPost(req, res) {
    try {
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
      if (post.authorId !== req.authData.id) {
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
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async deletePost(req, res) {
    try {
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
      if (post.authorId !== req.authData.id) {
        return res.status(403).json({
          message: "You are not authorized to delete this post",
        });
      }

      await prisma.post.delete({
        where: {
          id: String(id),
        },
      });

      res.json({
        message: "working",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  async getAllPosts(req, res) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          isPublished: true,
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // console.log(posts);

      const formattedPosts = posts.map((post) => ({
        ...post,
        authorName: post.author
          ? `${post.author.firstName} ${post.author.lastName}`.trim()
          : "Unknown",
        author: undefined, // Remove the original author object
      }));

      console.log(formattedPosts);

      res.json({ posts: formattedPosts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  async createCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({
          message: "Name is required",
        });
      }
      const newCategory = await prisma.category.create({
        data: {
          name,
        },
      });

      res.json({
        message: "Category created",
        category: newCategory,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = postController;
