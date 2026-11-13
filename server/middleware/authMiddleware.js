
import jwt from "jsonwebtoken";
import process from "node:process";

const authMiddleware = (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;

  // Check server configuration
  if (!jwtSecret) {
    return res.status(500).json({
      message: "Server authentication misconfiguration",
    });
  }

  // Check authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  // Extract token
  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(token, jwtSecret);

    // Validate token payload
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "string" ||
      !decoded.userId
    ) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    // Attach authenticated user ID
    req.userId = decoded.userId;

    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
