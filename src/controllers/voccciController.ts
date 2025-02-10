import { Request, Response } from "express";
import multer from "multer";
import prisma from "../config/db";
import { getVoccciFromImage } from "../services/openaiService";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }

    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const wordPairs = await getVoccciFromImage(req.file.buffer);

        if (!Array.isArray(wordPairs)) {
            throw new Error("Invalid response format from OpenAI - expected array");
        }

        await Promise.all(
            wordPairs.map(async (pair: { baseWord: string; translatedWord: string; wordPairType?: string }) => {
                await prisma.wordPair.create({
                    data: {
                        userId: userId,
                        baseWord: pair.baseWord,
                        translatedWord: pair.translatedWord,
                        wordPairType: pair.wordPairType || "default",
                    },
                });
            })
        );

        res.json({ message: "Word pairs stored successfully!", wordPairs });
    } catch (err) {
        console.error("Error processing image:", err);
        res.status(500).json({ error: "Error processing image" });
    }
};

export const getWordPairs = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const wordPairs = await prisma.wordPair.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        res.json(wordPairs);
    } catch (err) {
        console.error("Error fetching word pairs:", err);
        res.status(500).json({ error: "Error fetching word pairs" });
    }
};

export const getWordPairsByType = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { wordPairType } = req.params;

        const wordPairs = await prisma.wordPair.findMany({
            where: { userId, wordPairType },
            orderBy: { createdAt: "desc" },
        });

        res.json(wordPairs);
    } catch (err) {
        console.error("Error fetching word pairs by type:", err);
        res.status(500).json({ error: "Error fetching word pairs by type" });
    }
};

export const deleteWordPair = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { id } = req.params;

        const wordPair = await prisma.wordPair.findUnique({ where: { id } });

        if (!wordPair || wordPair.userId !== userId) {
            res.status(403).json({ error: "Not authorized to delete this word pair" });
            return;
        }

        await prisma.wordPair.delete({ where: { id } });

        res.json({ message: "Word pair deleted successfully" });
    } catch (err) {
        console.error("Error deleting word pair:", err);
        res.status(500).json({ error: "Error deleting word pair" });
    }
};

export { upload };
