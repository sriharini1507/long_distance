import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

// Save a new memory
window.saveMemory = function () {
  const coupleCode = localStorage.getItem("coupleCode");
  const memory = document.getElementById("memoryInput").value.trim();
  if (!memory) return;

  const memoryRef = push(ref(db, `couples/${coupleCode}/memories`));
  set(memoryRef, {
    text: memory,
    timestamp: Date.now()
  });

  document.getElementById("memoryInput").value = "";
};

// Load memories
window.loadMemories = function () {
  const coupleCode = localStorage.getItem("coupleCode");
  const memoryList = document.getElementById("memoryList");

  const refMem = ref(db, `couples/${coupleCode}/memories`);
  onValue(refMem, (snapshot) => {
    memoryList.innerHTML = "";
    snapshot.forEach(child => {
      const { text } = child.val();
      const li = document.createElement("li");
      li.textContent = text;
      memoryList.appendChild(li);
    });
  });
};
