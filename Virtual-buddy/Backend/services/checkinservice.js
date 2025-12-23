const greetings = [
  "Hey 😊 I'm here with you. How are you feeling today?",
  "Hi there 👋 Want to talk about what's on your mind?",
  "Hello 💛 I'm your virtual buddy. How’s your day going?",
  "Hey! I’m glad you’re here. How are you feeling right now?",
  "Hi 🙂 You don’t have to talk if you don’t want to — I’m here anyway."
];

export function getCheckInQuestion() {
  const index = Math.floor(Math.random() * greetings.length);
  return greetings[index];
}
