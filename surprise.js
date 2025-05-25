import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

let coupleCode = "";
const surpriseList = [
  "Plan a surprise video call 💻",
  "Send a love letter 💌",
  "Make a shared Spotify playlist 🎶",
  "Dress up for a virtual dinner 👗🕴",
  "Record a voice message 🎤",
  "Write a short poem ✍️",
  "Draw each other 🎨",
  "Send a morning selfie ☀️🤳",
  "Buy them a small gift online 🎁",
  "Do a photo collage 🖼️",
  "Tell them 3 things you love about them 💖"
];

window.loadSurprises = function () {
  coupleCode = document.getElementById("coupleCode").value.trim();
  if (!coupleCode) return alert("Enter your couple code.");
  document.getElementById("surpriseSection").style.display = "block";

  const sharedRef = ref(db, `couples/${coupleCode}/sharedSurprise`);
  onValue(sharedRef, (snapshot) => {
    const surprise = snapshot.val();
    if (surprise) {
      document.getElementById("sharedSurprise").textContent = `Your partner's surprise: ${surprise}`;
    }
  });
};

window.generateSurprise = function () {
  const random = surpriseList[Math.floor(Math.random() * surpriseList.length)];
  document.getElementById("surpriseText").textContent = random;
};

window.saveSurprise = function () {
  const text = document.getElementById("surpriseText").textContent;
  if (!text || !coupleCode) return;
  set(ref(db, `couples/${coupleCode}/sharedSurprise`), text);
};
