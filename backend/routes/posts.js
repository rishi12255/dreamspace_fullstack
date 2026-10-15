import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (["dream", "hobby"].includes(req.query.category)) {
      filter.category = req.query.category;
    }
    if (req.query.search?.trim()) {
      const search = req.query.search.trim().slice(0, 100);
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ];
    }
    const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Could not load posts." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, author, category } = req.body;
    if (!title?.trim() || !description?.trim() || !["dream", "hobby"].includes(category)) {
      return res.status(400).json({ message: "Title, description, and a valid category are required." });
    }
    const post = await Post.create({
      title: title.trim(),
      description: description.trim(),
      author: author?.trim() || "Dreamer",
      category
    });
    res.status(201).json(post);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please check your post details and try again." });
    }
    res.status(500).json({ message: "Could not create post." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID." });
    }
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found." });
    res.json({ message: "Post deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete post." });
  }
});

export default router;
