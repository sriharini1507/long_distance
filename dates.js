import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, push, remove, onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

window.loadDates = function () {
  const coupleCode = window.coupleCode;
  const dateRef = ref(db, `couples/${coupleCode}/dates`);
  const list = document.getElementById("dateList");

  onValue(dateRef, (snapshot) => {
    list.innerHTML = "";
    snapshot.forEach((child) => {
      const { date, event } = child.val();
      const li = document.createElement("li");
      li.innerHTML = `${date} - ${event} <button onclick="deleteDate('${child.key}')">❌</button>`;
      list.appendChild(li);
    });
  });
};

window.addDate = function () {
  const date = document.getElementById("dateInput").value;
  const event = document.getElementById("eventInput").value.trim();
  const coupleCode = window.coupleCode;

  if (!date || !event || !coupleCode) return;

  const dateRef = ref(db, `couples/${coupleCode}/dates`);
  push(dateRef, { date, event });

  document.getElementById("dateInput").value = "";
  document.getElementById("eventInput").value = "";
};

window.deleteDate = function (key) {
  const coupleCode = window.coupleCode;
  const itemRef = ref(db, `couples/${coupleCode}/dates/${key}`);
  remove(itemRef);
};
