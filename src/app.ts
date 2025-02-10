import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import voccciRoutes from "./routes/voccciRoutes";

const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));


app.use("/api/auth", authRoutes);
app.use("/api/voccci", voccciRoutes);

export default app;