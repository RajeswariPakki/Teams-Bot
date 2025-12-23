document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const input = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");

  // Helper to create message HTML
  function createMessageElement(sender, message, isUser) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");
    wrapper.classList.add(isUser ? "user" : "bot");

    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");

    const senderName = document.createElement("div");
    senderName.classList.add("message-sender");
    senderName.innerText = sender;

    const text = document.createElement("div");
    text.classList.add("message-text");
    text.innerText = message; 

    // Add avatar helper if bot (optional, structure supports it)
    if (!isUser) {
       const avatar = document.createElement("div");
       avatar.classList.add("avatar-circle");
       avatar.style.width = "24px";
       avatar.style.height = "24px";
       avatar.style.fontSize = "10px";
       avatar.innerText = "🤖";
       wrapper.appendChild(avatar);
    }
    
    bubble.appendChild(senderName);
    bubble.appendChild(text);
    wrapper.appendChild(bubble);

    return wrapper;
  }

  function appendMessage(sender, message, isUser) {
    const msgElement = createMessageElement(sender, message, isUser);
    chatMessages.appendChild(msgElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 🔹 Auto greeting
  fetch("http://localhost:5000/greeting")
    .then(res => res.json())
    .then(data => {
      if (data.message) appendMessage("Virtual Buddy", data.message, false);
    })
    .catch(console.error);

  // 🔹 Send message function
  async function sendMessage() {
    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage("You", userMessage, true);
    input.value = "";

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      appendMessage("Virtual Buddy", data.reply, false);
    } catch (err) {
      console.error(err);
      appendMessage("Virtual Buddy", "I’m here, but something went wrong 💛", false);
    }
  }

  // 🔹 Button click
  if (sendBtn) {
      sendBtn.addEventListener("click", sendMessage);
  }

  // 🔹 Enter key
  if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
      });
  }
});
