import blogModel from "../models/blog.js";
import dotenv from "dotenv";

dotenv.config();

//create posts
export const createBlog = async (req, res) => {
  try {
    const { userId, title, blogpost } = req.body;

    // Handle file upload
    const image = req.file ? `blogs/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({ error: "Cover picture is required." });
    }

    const newPost = await blogModel.create({
      userId,
      title,
      blogpost,
      image,
    });

    res.status(200).json({ message: "Blog created succesfully", newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch all blog
export const fetchAllBlog = async (req, res) => {
  try {
    const fetchBlogs = await blogModel
      .find({})
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "successful", fetchBlogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// edit post
export const editBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const updatePosts = await blogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Updated succesfully", updatePosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// delete post
export const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    await blogModel.findByIdAndRemove(id);

    res.status(200).json({ message: "deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// single post
export const getSingleBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const SinglePost = await blogModel
      .findById(id)
      .populate("userId", "username");
    res.status(200).json({ message: "Fetch successfully", getSingleBlog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to like a post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const updatedPost = await blogModel.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// fetch liked posts
export const fetchLikes = async (req, res) => {
  try {
    const postsWithLikes = await blogModel.find({}, { likes: 1 });

    res.status(200).json(postsWithLikes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getBlogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const myposts = await postModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(myposts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
