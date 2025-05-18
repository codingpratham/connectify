import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    if (!decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.userId; // ⬅️ Attach userId to request

    console.log("Decoded JWT:", decoded); // ✅ Log to debug
    console.log("User ID from token:", req.userId); // ✅ Log to debug
    
    next();
  } catch (error) {
    console.error("JWT error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
