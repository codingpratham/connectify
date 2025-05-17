import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../lib/jwt.js";
import { NextFunction, Request, Response } from "express";

interface JwtPayload {
  userId: string;
  email?: string;
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Get token from Authorization header or cookie
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = verifyToken(token) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, fullName: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Attach user and userId to request
    (req as any).user = user;
    (req as any).userId = user.id;

    console.log("Authenticated user:", user);
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
