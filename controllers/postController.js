import postModel from "../models/post.js";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

//create posts
export const createPost = async (req, res) => {
  try {
    const {
      userId,
      TradingCategory,
      exchangeCategory,
      offer,
      exchange,
      textAreaValue,
      location,
    } = req.body;

    // Handle file upload
    const image = req.file ? `uploads/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({ error: "Cover picture is required." });
    }

    const newPost = await postModel.create({
      userId,
      TradingCategory,
      exchangeCategory,
      offer,
      exchange,
      textAreaValue,
      location,
      image,
    });

    res.status(200).json({ message: "post sent succesfully", newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch all post
export const fetchAllPost = async (req, res) => {
  try {
    const fetchPosts = await postModel
      .find({})
      .populate("userId", "username phone")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "successful", fetchPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const postCount = async (req, res) => {
  try {
    const postCount = await postModel.countDocuments();
    res.status(200).json({ count: postCount });
  } catch (error) {
    console.error("Error fetching post count:", error);
    res.status(500).json({ message: error.message });
  }
};

// edit post
export const editPost = async (req, res) => {
  try {
    const id = req.params.id;
    const updatePosts = await postModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Updated succesfully", updatePosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// delete post
export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    await postModel.findByIdAndRemove(id);

    res.status(200).json({ message: "deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// change status
export const updatePostStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; // expecting "success" or "waiting"
    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Status updated successfully", updatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// single post
export const getSinglePost = async (req, res) => {
  try {
    const id = req.params.id;
    const SinglePost = await postModel
      .findById(id)
      .populate("userId", "username"); // Populate userId with username
    res.status(200).json({ message: "Fetch successfully", SinglePost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// posts by a user
export const getPostsByUser = async (req, res) => {
  try {
    // const userId = req.query.userId;
    const { userId } = req.params;
    // const objectId = new mongoose.Types.ObjectId(userId);
    const myposts = await postModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(myposts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch posts by categor
export const fetchPostsBySkills = async (req, res) => {
  try {
    const fetchPosts = await postModel
      .find({ TradingCategory: "Skills" })
      .populate("userId", "username phone")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "successful", fetchPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchPostsByProducts = async (req, res) => {
  try {
    const fetchPosts = await postModel
      .find({ TradingCategory: "Products" })
      .populate("userId", "username phone")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "successful", fetchPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchPostsByServices = async (req, res) => {
  try {
    const fetchPosts = await postModel
      .find({ TradingCategory: "Services" })
      .populate("userId", "username phone")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "successful", fetchPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchPostsByIdeas = async (req, res) => {
  try {
    const fetchPosts = await postModel
      .find({ TradingCategory: "Ideas" })
      .populate("userId", "username phone")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "successful", fetchPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//search

export const searchPosts = async (req, res) => {
  try {
    const { query } = req.query; // Get the general query string

    const searchQuery = {};

    if (query) {
      const regexQuery = { $regex: query, $options: "i" };
      searchQuery.$or = [
        { TradingCategory: regexQuery },
        { offer: regexQuery },
        { exchange: regexQuery },
        { exchangeCategory: regexQuery },
        { textAreaValue: regexQuery },
        { location: regexQuery },
      ];
    }

    const posts = await postModel
      .find(searchQuery)
      .populate("userId", "username phone")
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({ message: "Search successful", posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
