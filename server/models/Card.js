import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    role: {
      type: String,
      trim: true,
      default: "",
      maxlength: 80,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 180,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    portfolio: {
      type: String,
      trim: true,
      default: "",
    },

    avatar: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },


    backgroundImage: {
      type: String,
      default: null,
    },


    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


const Card = mongoose.model("Card", cardSchema);

export default Card;