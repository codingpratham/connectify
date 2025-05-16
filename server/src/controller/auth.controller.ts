import { Request, Response } from "express"; 
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "../lib/jwt";
import cloudinary from "../lib/cloudinary";

export const createAccount = async (req: Request, res: Response)  => {
  const {
    name,
    email,
    password,
  }= req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    }
  })

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const hashesPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data:{
        name,
        email,
        password: hashesPassword,
      }
    })
    
    const token = signToken ({
      userId : user.id
    })
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    
    return res.status(201).json({ message: "User created successfully", token });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
    
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = signToken({
      userId: user.id
    })

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
  
    return res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
    
  }
}

export const logout= async (req: Request, res: Response) => {

  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" ,
  });
}

export const onBoard = async (req: Request, res: Response) => {
  const { name, description, location } = req.body;
  const userId = req.userId;

  console.log("User ID:", userId);
  
  if (!name || !description || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }
  let avatarUrl: string | undefined = undefined;
  try {
    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error || !result) {
              return reject("Upload failed");
            }
            resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });
      avatarUrl = result.secure_url;
    }
    await prisma.onboarding.create({
      data: {
        name,
        description,
        location,
        avatarUrl,
        user: {
          connect: { id: userId },
        },
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { isOnboarded: true },
    });
    return res.status(201).json({ message: "Onboarding successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

