import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "../lib/jwt";
import { loginBody, signUpbody } from "../types/validate";


export const createAccount = async (req: Request, res: Response) => {
  const validation = signUpbody.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email :validation.data.email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(validation.data.password, 10);
    const user = await prisma.user.create({
      data: {
        fullName: validation.data.name,
        email: validation.data.email,
        password: hashedPassword,
      },
    });

    const token = signToken({ userId: user.id });
    return res.status(201).json({ message: "User created successfully", token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const validate =  loginBody.safeParse(req.body);

  if(!validate.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  

  try {
    const user = await prisma.user.findUnique({ where: { email :validate.data.email } });
    if (!user || !(await bcrypt.compare(validate.data.password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken({ userId: user.id });
    return res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};
