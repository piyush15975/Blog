import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      author: req.userId
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create post', error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name username').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get posts', error: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name username');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get post', error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ msg: 'Unauthorized' });

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update post', error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ msg: 'Unauthorized' });

    await post.deleteOne();
    res.status(200).json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete post', error: err.message });
  }
};
