import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { getAIReply } from "./services/aiService.js";
import { getCheckInQuestion } from "./services/checkinservice.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ index.js loaded");

// Health check
app.get("/", (req, res) => {
  res.send("Virtual Buddy Backend is running 🚀");
});

// 🔹 ONE-TIME greeting (frontend controls when to call)
app.get("/greeting", (req, res) => {
  res.json({ message: getCheckInQuestion() });
});

// 🔹 Chat (bot responds only to user input)
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "I’m here with you 💛" });
  }

  try {
    const reply = await getAIReply(message);
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.json({
      reply: "I’m here, but something went wrong on my side 💛"
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
