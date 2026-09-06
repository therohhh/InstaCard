import express from "express";

import {
  saveCard,
  getPublishedCards,
  getCardById,
  getMyCard,
} from "../controllers/cardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    saveCard
);

router.get(
    "/",
    authMiddleware,
    getPublishedCards
);


router.get(
  "/me",
  authMiddleware,
  getMyCard
);

router.get(
    "/:id",
    authMiddleware,
    getCardById
);

export default router;