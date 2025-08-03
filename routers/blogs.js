const express = require('express');
const router = express.Router();
const Blog = require("../models/blogSchema");
const authMiddleware = require("../middlewares/auth");
const { blogSchema } = require("../validators/blogValidator");

// CREATE BLOG (Validated + Authenticated)
router.post("/", authMiddleware, async (req, res, next) => {
  const { error } = blogSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { title, description, tags } = req.body;
    const blog = new Blog({
      title,
      description,
      tags,
      author: req1._id,
    });
    console.log(req1)
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { search, tags, sort = "desc", page = 1, limit = 10 } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (tags) query.tags = { $in: tags.split(',') };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      blogs,
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    console.log(req.params)
    const blog = await Blog.findById(req.params._id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req1._id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req1._id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
