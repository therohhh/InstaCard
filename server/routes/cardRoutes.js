import express from "express";

import {
    saveCard,
    updateMyCard,
    getPublishedCards,
    getCardById,
    getMyCard,
} from "../controllers/cardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   CREATE CARD
========================================================= */

router.post(
    "/",
    authMiddleware,
    saveCard
);

/* =========================================================
   GET ALL PUBLISHED CARDS
========================================================= */

router.get(
    "/",
    authMiddleware,
    getPublishedCards
);

/* =========================================================
   GET CURRENT USER'S CARD
========================================================= */

router.get(
    "/me",
    authMiddleware,
    getMyCard
);

/* =========================================================
   UPDATE CURRENT USER'S CARD
========================================================= */

router.put(
    "/me",
    authMiddleware,
    updateMyCard
);

/* =========================================================
   GET SPECIFIC PUBLISHED CARD
========================================================= */

router.get(
    "/:id",
    authMiddleware,
    getCardById
);

export default router;