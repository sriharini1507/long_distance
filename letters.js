import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase config
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

// Load saved letters from Firebase
window.loadLetters = function () {
  coupleCode = document.getElementById("coupleCode").value.trim();
  if (!coupleCode) {
    alert("Please enter a couple code.");
    return;
  }

  document.getElementById("letterSection").style.display = "block";
  const letterRef = ref(db, `couples/${coupleCode}/letters`);

  onValue(letterRef, (snapshot) => {
    const list = document.getElementById("letterList");
    list.innerHTML = "";
    snapshot.forEach((child) => {
      const li = document.createElement("li");
      li.textContent = child.val();
      list.appendChild(li);
    });
  });
};

// Save a new letter
window.saveLetter = function () {
  const text = document.getElementById("letterInput").value.trim();
  if (!text || !coupleCode) {
    alert("Missing couple code or letter text.");
    return;
  }

  const letterRef = ref(db, `couples/${coupleCode}/letters`);
  push(letterRef, text);
  document.getElementById("letterInput").value = "";
};
