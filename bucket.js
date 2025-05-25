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

window.addBucketItem = function () {
  const text = document.getElementById("bucketInput").value.trim();
  const coupleCode = window.coupleCode;
  if (!text || !coupleCode) return;

  const listRef = ref(db, `couples/${coupleCode}/bucket/active`);
  push(listRef, text);
  document.getElementById("bucketInput").value = "";
};

window.loadActiveList = function () {
  const coupleCode = window.coupleCode;
  const activeRef = ref(db, `couples/${coupleCode}/bucket/active`);
  const listEl = document.getElementById("activeList");

  onValue(activeRef, (snapshot) => {
    listEl.innerHTML = "";
    snapshot.forEach((child) => {
      const item = child.val();
      const li = document.createElement("li");
      li.innerHTML = `
  <label class="bucket-item">
    <input type="checkbox" onchange="completeBucketItem('${child.key}', \`${item}\`)">
    <span>${item}</span>
  </label>
`;


      listEl.appendChild(li);
    });
  });
};

window.loadCompletedList = function () {
  const coupleCode = window.coupleCode;
  const compRef = ref(db, `couples/${coupleCode}/bucket/completed`);
  const compEl = document.getElementById("completedList");

  onValue(compRef, (snapshot) => {
    compEl.innerHTML = "";
    snapshot.forEach((child) => {
      const item = child.val();
      const li = document.createElement("li");
      li.textContent = item;
      compEl.appendChild(li);
    });
  });
};

window.completeBucketItem = function (key, value) {
  const coupleCode = window.coupleCode;
  const activeItemRef = ref(db, `couples/${coupleCode}/bucket/active/${key}`);
  const completedRef = ref(db, `couples/${coupleCode}/bucket/completed`);
  remove(activeItemRef);
  push(completedRef, value);
};
