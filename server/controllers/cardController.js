import mongoose from "mongoose";
import Card from "../models/Card.js";

/* =========================================================
   CARD DATA NORMALIZER
========================================================= */

const buildCardData = (req) => {
  const {
    name,
    role,
    bio,
    skills,
    github,
    linkedin,
    portfolio,
    avatar,
    backgroundImage,
    status,
  } = req.body;

  const normalizedStatus =
    status === "published" ? "published" : "draft";

  const normalizedSkills = Array.isArray(skills)
    ? skills
        .filter(
          (skill) =>
            typeof skill === "string" &&
            skill.trim().length > 0
        )
        .map((skill) => skill.trim())
        .slice(0, 8)
    : [];

  return {
    user: req.userId,

    name: name.trim(),

    role:
      typeof role === "string"
        ? role.trim()
        : "",

    bio:
      typeof bio === "string"
        ? bio.trim().slice(0, 180)
        : "",

    skills: normalizedSkills,

    github:
      typeof github === "string"
        ? github.trim()
        : "",

    linkedin:
      typeof linkedin === "string"
        ? linkedin.trim()
        : "",

    portfolio:
      typeof portfolio === "string"
        ? portfolio.trim()
        : "",

    avatar:
      avatar !== undefined
        ? avatar
        : null,

    backgroundImage:
      backgroundImage || null,

    status: normalizedStatus,
  };
};


/* =========================================================
   CREATE CARD
========================================================= */

export const saveCard = async (req, res) => {
  try {
    const { name } = req.body;

    /* =======================================================
       VALIDATION
    ======================================================= */

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    /* =======================================================
       PREVENT DUPLICATE CARD
    ======================================================= */

    const existingCard = await Card.findOne({
      user: req.userId,
    });

    if (existingCard) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an InstaCard. Use the update endpoint to edit it.",
        card: existingCard,
      });
    }

    /* =======================================================
       CREATE
    ======================================================= */

    const cardData = buildCardData(req);

    const card = await Card.create(cardData);

    await card.populate(
      "user",
      "name email"
    );

    /* =======================================================
       RESPONSE
    ======================================================= */

    return res.status(201).json({
      success: true,
      message:
        card.status === "published"
          ? "Card published successfully"
          : "Card saved successfully",
      card,
    });
  } catch (error) {
    console.error(
      "Create card error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A card already exists for this user.",
      });
    }

    if (
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid card data.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* =========================================================
   UPDATE CURRENT USER'S CARD
========================================================= */

export const updateMyCard = async (
  req,
  res
) => {
  try {
    const { name } = req.body;

    /* =======================================================
       VALIDATION
    ======================================================= */

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    /* =======================================================
       FIND OWN CARD
    ======================================================= */

    const existingCard = await Card.findOne({
      user: req.userId,
    });

    if (!existingCard) {
      return res.status(404).json({
        success: false,
        message:
          "You haven't created an InstaCard yet.",
      });
    }

    /* =======================================================
       UPDATE ONLY OWNER'S CARD
    ======================================================= */

    const cardData = buildCardData(req);

    const card =
      await Card.findOneAndUpdate(
        {
          _id: existingCard._id,
          user: req.userId,
        },
        {
          $set: cardData,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "user",
        "name email"
      );

    if (!card) {
      return res.status(404).json({
        success: false,
        message:
          "Card not found.",
      });
    }

    /* =======================================================
       RESPONSE
    ======================================================= */

    return res.status(200).json({
      success: true,
      message:
        card.status === "published"
          ? "Card updated successfully"
          : "Card saved successfully",
      card,
    });
  } catch (error) {
    console.error(
      "Update card error:",
      error
    );

    if (
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid card data.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* =========================================================
   GET ALL PUBLISHED CARDS
========================================================= */

export const getPublishedCards = async (
  req,
  res
) => {
  try {
    const cards = await Card.find({
      status: "published",
    })
      .populate("user", "name email")
      .sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      cards,
    });
  } catch (error) {
    console.error(
      "Get published cards error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* =========================================================
   GET PUBLISHED CARD BY ID
========================================================= */

export const getCardById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    /* =======================================================
       INVALID OBJECT ID
    ======================================================= */

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid card ID",
      });
    }

    const card = await Card.findOne({
      _id: id,
      status: "published",
    }).populate(
      "user",
      "name email"
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      card,
    });
  } catch (error) {
    console.error(
      "Get card error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* =========================================================
   GET CURRENT USER'S CARD
========================================================= */

export const getMyCard = async (
  req,
  res
) => {
  try {
    const card = await Card.findOne({
      user: req.userId,
    }).populate(
      "user",
      "name email"
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        message:
          "You haven't created an InstaCard yet",
      });
    }

    return res.status(200).json({
      success: true,
      card,
    });
  } catch (error) {
    console.error(
      "Get my card error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};