import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { env } from "node:process";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

app.use(
    express.json({
        limit: "25mb",
    })
);

/* =========================================================
   DATABASE
========================================================= */

connectDB();

/* =========================================================
   ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/cards", cardRoutes);

app.use("/api/upload", uploadRoutes);

/* =========================================================
   TEST ROUTE
========================================================= */

app.get("/", (req, res) => {
    res.status(200).json({
        message: "InstaCard API is running",
    });
});

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
    void next;
    console.error("Server error:", err);

    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        return res.status(400).json({
            message: "Invalid JSON payload",
        });
    }

    if (err.type === "entity.too.large") {
        return res.status(413).json({
            message: "Request payload is too large",
        });
    }

    res.status(500).json({
        message: "Server error",
    });
});

/* =========================================================
   SERVER
========================================================= */

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});