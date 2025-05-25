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

const affirmations = [
  "You are loved more than words can say 💖",
  "Distance means so little when someone means so much 🌍",
  "You’re doing amazing, keep shining ✨",
  "Our love story is my favorite 📖",
  "You’re my today and all of my tomorrows 🫶",
  "The best part of my day is thinking of you ☀️",
  "You and I are a perfect match 🔥",
  "Together or apart, you're always in my heart 💌",
  "Love knows no distance 💫",
  "You make my heart smile 😊"
];

window.loadAffirmation = function () {
  coupleCode = document.getElementById("coupleCode").value.trim();
  if (!coupleCode) return alert("Enter your couple code");

  document.getElementById("affirmSection").style.display = "block";

  const refPath = ref(db, `couples/${coupleCode}/sharedAffirmation`);
  onValue(refPath, (snapshot) => {
    const msg = snapshot.val();
    if (msg) {
      document.getElementById("sharedAffirmation").textContent = `❤️ Partner's affirmation: "${msg}"`;
    }
  });

  refreshAffirmation(); // Show a random one on load
};

window.refreshAffirmation = function () {
  const text = affirmations[Math.floor(Math.random() * affirmations.length)];
  document.getElementById("affirmText").textContent = text;
};

window.shareAffirmation = function () {
  const text = document.getElementById("affirmText").textContent;
  if (!text || !coupleCode) return;
  set(ref(db, `couples/${coupleCode}/sharedAffirmation`), text);
};
