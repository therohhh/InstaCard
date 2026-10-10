import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

const buildParticipantKey = (userA, userB) => {
  return [String(userA), String(userB)].sort().join("_");
};

export const findOrCreateConversation = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { userId: otherUserId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (String(currentUserId) === String(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot start a conversation with yourself",
      });
    }

    const otherUser = await User.findById(otherUserId).select(
      "_id name email"
    );

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const participantKey = buildParticipantKey(
      currentUserId,
      otherUserId
    );

    let conversation = await Conversation.findOne({
      participantKey,
    }).populate("participants", "name email");

    if (conversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation found",
        conversation,
      });
    }

    conversation = await Conversation.create({
      participants: [currentUserId, otherUserId],
      participantKey,
    });

    await conversation.populate(
      "participants",
      "name email"
    );

    return res.status(201).json({
      success: true,
      message: "Conversation created",
      conversation,
    });
  } catch (error) {
    console.error(
      "Find/create conversation error:",
      error
    );

    if (error.code === 11000) {
      const participantKey = buildParticipantKey(
        req.userId,
        req.params.userId
      );

      const conversation = await Conversation.findOne({
        participantKey,
      }).populate("participants", "name email");

      if (conversation) {
        return res.status(200).json({
          success: true,
          message: "Conversation found",
          conversation,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email")
      .sort({
        lastMessageAt: -1,
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error(
      "Get my conversations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};