import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "All fields required" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        res.status(201).json({ message: "User created", userId: user.id });
    } catch (err) {
        res.status(400).json({ error: "Email already exists" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
    }

    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.json({ token });
};
