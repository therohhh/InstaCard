
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import process from "node:process";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header,
            // such as command-line tools and server-to-server requests.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin not allowed by CORS"));
        },
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
        limit: "2mb",
    })
);

/* =========================================================
   DATABASE
========================================================= */

app.get("/", (req, res) => {
    res.status(200).json({
        message: "InstaCard API is running",
    });
});

/* =========================================================
   ROUTES
========================================================= */

app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

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
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON payload",
        });
    }

    if (err.type === "entity.too.large") {
        return res.status(413).json({
            message: "Request payload is too large",
        });
    }

    if (err.message === "Origin not allowed by CORS") {
        return res.status(403).json({
            message: "Origin not allowed",
        });
    }

    console.error("Server error:", err);

    return res.status(500).json({
        message: "Server error",
    });
});

/* =========================================================
   SERVER STARTUP
========================================================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`InstaCard API running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
