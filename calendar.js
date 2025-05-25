import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, push, onValue, remove
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

// ✅ Add event
window.addCalendarEvent = function () {
  const date = document.getElementById("eventDate").value;
  const name = document.getElementById("eventName").value.trim();
  const coupleCode = window.coupleCode;

  if (!date || !name || !coupleCode) return;

  const calRef = ref(db, `couples/${coupleCode}/calendar`);
  push(calRef, { date, name });

  document.getElementById("eventDate").value = "";
  document.getElementById("eventName").value = "";
};

// ✅ Load all events
window.loadCalendarEvents = function () {
  const coupleCode = window.coupleCode;
  const calRef = ref(db, `couples/${coupleCode}/calendar`);
  const list = document.getElementById("calendarList");

  onValue(calRef, (snapshot) => {
    list.innerHTML = "";
    snapshot.forEach((child) => {
      const { date, name } = child.val();
      const daysLeft = calcDaysLeft(date);
      const li = document.createElement("li");
      li.className = "bucket-item";
      li.innerHTML = `
        <strong>${name}</strong> — ${formatDate(date)} 
        <span style="margin-left:auto;">(${daysLeft} days left)</span>
      `;
      list.appendChild(li);
    });
  });
};

// ✅ Utility
function calcDaysLeft(targetDate) {
  const now = new Date();
  const date = new Date(targetDate);
  const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : 0;
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });
}
