import express from "express";
import { uploadImage, getWordPairs, getWordPairsByType, deleteWordPair, upload } from "../controllers/voccciController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/upload", authenticateToken, upload.single("image"), uploadImage);
router.get("/", authenticateToken, getWordPairs);
router.get("/:wordPairType", authenticateToken, getWordPairsByType);
router.delete("/:id", authenticateToken, deleteWordPair);

export default router;
