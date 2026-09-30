import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, uploadImage);

export default router;