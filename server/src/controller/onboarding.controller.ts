import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import cloudinary from "../lib/cloudinary";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const onBoard = async (req: Request, res: Response) => {
  const { name, description, location } = req.body;
  const userId = req.userId;

  if (!name || !description || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let avatarUrl: string | undefined = undefined;

    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error || !result) {
              return reject(new Error("Error uploading image"));
            }
            avatarUrl = result.secure_url;
            resolve(result);
          }
        );
        if (req.file && req.file.buffer) {
          stream.end(req.file.buffer);
        } else {
          reject(new Error("File buffer is missing"));
          res.status(400).json({ message: "File buffer is missing" });
        }
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: name,
        bio: description,
        location,
        profilePic: avatarUrl,
        isOnboarded: true,
      },
    });

    return res.status(201).json({ message: "Onboarding successful" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
