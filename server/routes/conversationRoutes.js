import express from "express";

import {
  findOrCreateConversation,
  getMyConversations,
} from "../controllers/conversationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getMyConversations
);

router.post(
  "/:userId",
  authMiddleware,
  findOrCreateConversation
);

export default router;