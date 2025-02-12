import express from "express";
import blogimage from "../blogimage.js";

const router = express.Router();

import {
  createBlog,
  fetchAllBlog,
  editBlog,
  deleteBlog,
  getSingleBlog,
  likePost,
  fetchLikes,
  getBlogsByUser,
} from "../controllers/blogController.js";

import auth from "../middleware/auth.js";

router.post("/create-blog", auth, blogimage.single("image"), createBlog);
router.get("/get-blogs", fetchAllBlog);
router.put("/blogs/edit/:id", editBlog);
router.delete("/blogs/edit/:id", auth, deleteBlog);
router.get("/blogs/:id", getSingleBlog);
router.put("/blogs/:postId/like", likePost);
router.get("/blogs/like", fetchLikes);
router.get("/blogs/:userId", getBlogsByUser);

export default router;
