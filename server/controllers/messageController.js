import mongoose from "mongoose";

import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

const verifyConversationParticipant = async (
  conversationId,
  userId
) => {
  return Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });
};

/* =========================================================
   SEND MESSAGE
   ========================================================= */

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    if (
      typeof text !== "string" ||
      !text.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const conversation =
      await verifyConversationParticipant(
        conversationId,
        senderId
      );

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a participant in this conversation",
      });
    }

    const receiverId =
      conversation.participants.find(
        (participant) =>
          String(participant) !== String(senderId)
      );

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      receiver: receiverId,
      text: text.trim(),
    });

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: text.trim(),
        lastMessageAt: message.createdAt,
      }
    );

    await message.populate(
      "sender",
      "name email"
    );

    await message.populate(
      "receiver",
      "name email"
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   GET CONVERSATION MESSAGES
   ========================================================= */

export const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const conversation =
      await verifyConversationParticipant(
        conversationId,
        userId
      );

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a participant in this conversation",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error(
      "Get messages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};