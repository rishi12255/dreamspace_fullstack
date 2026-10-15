import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import postsRouter from "./routes/posts.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/posts", postsRouter);

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI. Create backend/.env using .env.example.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`API listening at http://localhost:${port}`));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

start();
