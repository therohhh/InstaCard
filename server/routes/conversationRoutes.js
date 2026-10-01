import express from "express";

import {
  findOrCreateConversation,
} from "../controllers/conversationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/:userId",
  authMiddleware,
  findOrCreateConversation
);

export default router;