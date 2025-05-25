import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7PCb0SI9_v8e9pG6btPgLphTRjj-pjkE",
  authDomain: "cutie-pattoottiee.firebaseapp.com",
  databaseURL: "https://cutie-pattoottiee-default-rtdb.firebaseio.com",
  projectId: "cutie-pattoottiee",
  storageBucket: "cutie-pattoottiee.appspot.com",
  messagingSenderId: "447988126330",
  appId: "1:447988126330:web:51babde06e66e74cf5a1c3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let coupleCode = localStorage.getItem("coupleCode");

// ----------------- Login + Dashboard -----------------

window.generateCode = function () {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  document.getElementById("coupleCode").value = code;
};

window.login = function () {
  coupleCode = document.getElementById("coupleCode")?.value.trim();
  if (coupleCode) {
    localStorage.setItem("coupleCode", coupleCode);
    document.getElementById("login")?.style.setProperty("display", "none");
    document.getElementById("dashboard")?.style.setProperty("display", "block");
    const display = document.getElementById("codeDisplay");
    if (display) display.textContent = coupleCode;

    listenToMood();
    listenToMessage();
    listenToDate();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("coupleCode");
  coupleCode = saved;
  const input = document.getElementById("coupleCode");
  if (input) input.value = saved;

  const dash = document.getElementById("dashboard");
  const loginDiv = document.getElementById("login");
  const codeDisplay = document.getElementById("codeDisplay");

  if (!saved && !window.location.href.includes("index.html")) {
    alert("Please login from the dashboard first.");
    window.location.href = "index.html";
  } else {
    if (dash && loginDiv) {
      loginDiv.style.display = "none";
      dash.style.display = "block";
      if (codeDisplay) codeDisplay.textContent = coupleCode;
    }

    // Always start listeners if possible
    if (typeof listenToMood === "function") listenToMood();
    if (typeof listenToMessage === "function") listenToMessage();
    if (typeof listenToDate === "function") listenToDate();
  }
});

// ----------------- Messaging (Multiple messages) -----------------

window.sendMessage = function () {
  const msg = document.getElementById("messageInput")?.value?.trim();
  if (!msg || !coupleCode) return;

  const messagesRef = ref(db, `couples/${coupleCode}/messages`);
  const newMsgRef = push(messagesRef);
  set(newMsgRef, {
    text: msg,
    timestamp: Date.now()
  });

  document.getElementById("messageInput").value = "";
};

window.listenToMessage = function () {
  if (!coupleCode) return;

  const msgRef = ref(db, `couples/${coupleCode}/messages`);
  onValue(msgRef, (snapshot) => {
    const display = document.getElementById("lastMessage");
    if (!display) return;

    const messages = [];
    snapshot.forEach((child) => {
      messages.push(child.val());
    });

    const latest = messages
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .reverse();

    display.innerHTML = latest.map(msg => `💬 ${msg.text}`).join("<br>");
  });
};

// ----------------- Mood Tracking -----------------

const moodInput = document.getElementById("mood");
if (moodInput) {
  moodInput.addEventListener("change", () => {
    const mood = moodInput.value;
    set(ref(db, `couples/${coupleCode}/mood`), mood);
  });
}

function listenToMood() {
  const moodRef = ref(db, `couples/${coupleCode}/mood`);
  onValue(moodRef, (snapshot) => {
    const mood = snapshot.val();
    const display = document.getElementById("moodDisplay");
    if (display && mood) display.textContent = `Your partner feels ${mood}`;
  });
}

// ----------------- Countdown -----------------

const meetDateInput = document.getElementById("meetDate");
if (meetDateInput) {
  meetDateInput.addEventListener("change", () => {
    const date = meetDateInput.value;
    set(ref(db, `couples/${coupleCode}/meetDate`), date);
  });
}

function listenToDate() {
  const dateRef = ref(db, `couples/${coupleCode}/meetDate`);
  onValue(dateRef, (snapshot) => {
    const val = snapshot.val();
    const display = document.getElementById("daysLeft");
    if (val && display) {
      const target = new Date(val);
      const today = new Date();
      const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
      display.textContent = `${diff} days left 💞`;
    }
  });
}

// ----------------- Chatbot -----------------

const chatbotButton = document.getElementById("chatbot-button");
const chatbotWindow = document.getElementById("chatbot-window");
const chatLog = document.getElementById("chat-log");
const chatInput = document.getElementById("chat-input");

if (chatbotButton && chatbotWindow) {
  chatbotButton.onclick = () => {
    chatbotWindow.style.display = chatbotWindow.style.display === "none" ? "block" : "none";
  };
}

if (chatInput) {
  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const msg = chatInput.value;
      const botReply = getBotResponse(msg);
      chatLog.innerHTML += `<div><strong>You:</strong> ${msg}</div><div><strong>DearBot:</strong> ${botReply}</div>`;
      chatInput.value = "";
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  });
}

function getBotResponse(msg) {
  msg = msg.toLowerCase();
  if (msg.includes("idea")) return "Plan a surprise video call or movie night 💻🍿";
  if (msg.includes("smile")) return "Send them a voice note saying why you love them 💖";
  if (msg.includes("gift")) return "How about a shared Spotify playlist or poem? 🎁";
  if (msg.includes("date")) return "Virtual dinner with dress-up + shared dessert 🍰";
  return "I'm here to help spark love 💡 Try asking: 'date idea' or 'how to make them smile'";
}
