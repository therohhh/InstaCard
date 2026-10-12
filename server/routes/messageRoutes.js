
import express from "express";

import {
    sendMessage,
    getMessages,
    getUnreadCount,
    markConversationAsRead,
} from "../controllers/messageController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* Unread count — keep this before /:conversationId */
router.get(
    "/unread-count",
    authMiddleware,
    getUnreadCount
);

/* Mark messages in a conversation as read */
router.patch(
    "/:conversationId/read",
    authMiddleware,
    markConversationAsRead
);

/* Send a message */
router.post(
    "/:conversationId",
    authMiddleware,
    sendMessage
);

/* Fetch conversation messages */
router.get(
    "/:conversationId",
    authMiddleware,
    getMessages
);

export default router;
