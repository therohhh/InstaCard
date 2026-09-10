import express from "express";

import {
  saveCard,
  getPublishedCards,
  getCardById,
  getMyCard,
} from "../controllers/cardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create or update the logged-in user's card
router.post("/", authMiddleware, saveCard);

// Get all published cards
router.get("/", authMiddleware, getPublishedCards);

// Get the logged-in user's own card
router.get("/me", authMiddleware, getMyCard);

// Get a specific published card
router.get("/:id", authMiddleware, getCardById);

export default router;