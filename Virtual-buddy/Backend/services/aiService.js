import fetch from "node-fetch";
import { analyzeSentiment } from "./sentimentService.js";

// Polite declines if user is abusive
const politeDeclines = [
  "I want to support you, but I can’t engage with hurtful language.",
  "Let’s keep things respectful so we can talk comfortably.",
  "I’m here to help, but I need the conversation to stay kind."
];

// In-memory emotion history (demo purpose)
let emotionHistory = [];

export async function getAIReply(userMessage) {
  if (!userMessage.trim()) {
    return "I’m here whenever you feel like sharing 💛";
  }

  try {
    // 1️⃣ Analyze emotion
    const sentiment = await analyzeSentiment(userMessage);

    // 2️⃣ Store emotion (demo)
    emotionHistory.push({
      message: userMessage,
      emotion: sentiment,
      timestamp: new Date()
    });

    // 3️⃣ Handle abusive input
    if (sentiment === "abusive") {
      return politeDeclines[Math.floor(Math.random() * politeDeclines.length)];
    }

    // 4️⃣ Generate response from Ollama
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3:mini",
        prompt: `
You are a friendly emotional support buddy.
You listen without judgment and respond warmly.

User emotion detected: ${sentiment}

User message:
"${userMessage}"

Respond in a supportive, calm, and human way.
Keep it short and friendly.
`,
        stream: false
      })
    });

    const data = await response.json();

    return data?.response?.trim() ||
      "I’m listening — tell me more if you’d like 💭";

  } catch (error) {
    console.error("AI Service Error:", error);
    return "I’m here, but I had a small issue just now 💛";
  }
}

// Optional (for future demo extension)
export function getEmotionHistory() {
  return emotionHistory;
}
