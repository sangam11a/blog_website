// routers/comments.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/blogSchema');
const authMiddleware = require('../middlewares/auth');

// GET all comments for a blog
router.get('/:blogId', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId).populate('comments.author', 'username email');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog.comments);
  } catch (err) {
    next(err);
  }
});

// ADD a new comment
router.post('/:blogId', authMiddleware, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = {
      text: req.body.text,
      author: req1._id,
      createdAt: new Date()
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

// DELETE a comment
router.delete('/:blogId/:commentId', authMiddleware, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    // Optional: Only allow author to delete their comment
    if (comment.author.toString() !== req1._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await blog.save();

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
});

// UPDATE a comment
router.put('/:blogId/:commentId', authMiddleware, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.author.toString() !== req1._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }

    comment.text = req.body.text;
    await blog.save();

    res.json(comment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
