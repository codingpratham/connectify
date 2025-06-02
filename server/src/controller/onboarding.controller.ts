import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { onBoardBody } from "../types/validate";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const onBoard = async (req: Request, res: Response) => {
  const validate = onBoardBody.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const { name, bio, location, profilePic } = validate.data;
  const userId = req.userId;

  console.log("User ID from token:", userId); // ✅ Log to debug

  if (!userId || !name || !bio || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: name,
        bio,
        location,
        profilePic,
        isOnboarded: true,
      },
    });

    return res.status(201).json({ message: "Onboarding successful" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
