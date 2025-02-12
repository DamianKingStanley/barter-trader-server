import express from "express";
import upload from "../multer.js";

const router = express.Router();

import {
  createPost,
  fetchAllPost,
  editPost,
  deletePost,
  updatePostStatus,
  getSinglePost,
  getPostsByUser,
  postCount,
  fetchPostsBySkills,
  fetchPostsByProducts,
  fetchPostsByServices,
  fetchPostsByIdeas,
  searchPosts,
} from "../controllers/postController.js";

import auth from "../middleware/auth.js";

router.post("/post", auth, upload.single("image"), createPost);
router.get("/posts", fetchAllPost);
router.get("/posts/count", postCount);
router.put("/posts/edit/:id", editPost);
router.delete("/posts/edit/:id", auth, deletePost);
router.patch("/posts/status/:id", auth, updatePostStatus);
router.get("/post/:id", getSinglePost);
router.get("/posts/:userId", getPostsByUser);
router.get("/get-skills-posts", fetchPostsBySkills);
router.get("/get-products-posts", fetchPostsByProducts);
router.get("/get-service-posts", fetchPostsByServices);
router.get("/get-ideas-posts", fetchPostsByIdeas);
router.get("/search-for-posts", searchPosts);

export default router;
