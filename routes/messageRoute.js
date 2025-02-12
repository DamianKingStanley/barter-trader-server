import express from "express";

const router = express.Router();

import {
  sendMessage,
  receiveMessage,
  getUserConversations,
} from "../controllers/messageController.js";

import auth from "../middleware/auth.js";

router.post("/send-message", auth, sendMessage);
router.get("/messages/:userId/:otherUserId", auth, receiveMessage);
router.get("/conversations/:userId", auth, getUserConversations);

export default router;
