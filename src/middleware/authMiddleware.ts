import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: { userId: string };
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.header("Authorization");

    if (!token) {
        res.status(401).json({ error: "Access denied" });
        return;
    }

    try {
        const tokenValue = token.split(" ")[1];
        const verified = jwt.verify(tokenValue, process.env.JWT_SECRET as string) as { userId: string };
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
        return;
    }
};

