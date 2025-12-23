import fetch from "node-fetch";

const ALLOWED_SENTIMENTS = ["positive", "neutral", "negative", "abusive"];

import { badWords } from "../config/badWords.js";

export async function analyzeSentiment(message) {
  // 0️⃣ Local Bad Word Check (Faster & stricter)
  const lowerCaseMessage = message.toLowerCase();
  const hasBadWord = badWords.some((word) => {
    // Escape special regex characters just in case, though our list is simple
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedWord}\\b`, "i");
    return regex.test(lowerCaseMessage);
  });

  if (hasBadWord) {
    return "abusive";
  }

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3:mini",
        prompt: `
You are a content moderation and sentiment analysis assistant.

Analyze the following user message and respond with ONLY ONE word:
positive, neutral, negative, abusive

User message:
"${message}"
`,
        stream: false
      })
    });

    const data = await response.json();

    // Debug log
    console.log("Sentiment raw response:", data);

    if (!data.response) return "neutral"; // fallback

    const sentiment = data.response.trim().toLowerCase();

    // Validate response
    return ALLOWED_SENTIMENTS.includes(sentiment) ? sentiment : "neutral";

  } catch (err) {
    console.error("Sentiment Service Error:", err);
    return "neutral"; // fallback if error occurs
  }
}
