import Card from "../models/Card.js";

/* =========================================================
   CREATE / UPDATE CARD
========================================================= */

export const saveCard = async (req, res) => {
  try {
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

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const card = await Card.findOneAndUpdate(
      { user: req.userId },

      {
        user: req.userId,
        name: name.trim(),
        role: role || "",
        bio: bio || "",
        skills: skills || [],
        github: github || "",
        linkedin: linkedin || "",
        portfolio: portfolio || "",
        avatar: avatar || null,
        backgroundImage: backgroundImage || null,
        status: status || "draft",
      },

      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message:
        status === "published"
          ? "Card published successfully"
          : "Card saved successfully",

      card,
    });
  } catch (error) {
    console.error("Save card error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getPublishedCards = async (req, res) => {
    try {
        const cards = await Card.find({
            status: "published",
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            cards,
        });
    } catch (error) {
        console.error("Get published cards error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};
export const getCardById = async (req, res) => {
    try {
        const card = await Card.findOne({
            _id: req.params.id,
            status: "published",
        }).populate("user", "name email");

        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        res.status(200).json({
            card,
        });
    } catch (error) {
        console.error("Get card error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

export const getMyCard = async (req, res) => {
  try {
    const card = await Card.findOne({
      user: req.userId,
    }).populate("user", "name email");

    if (!card) {
      return res.status(404).json({
        message: "You haven't created an InstaCard yet",
      });
    }

    res.status(200).json({
      card,
    });
  } catch (error) {
    console.error("Get my card error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

