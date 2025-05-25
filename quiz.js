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
let yourName = "";

window.startQuiz = function () {
  coupleCode = document.getElementById("coupleCode").value.trim();
  yourName = document.getElementById("yourName").value.trim();
  if (!coupleCode || !yourName) return alert("Enter both code and name.");

  document.getElementById("quizSection").style.display = "block";

  const otherName = yourName === "A" ? "B" : "A";
  const refPath = ref(db, `couples/${coupleCode}/quiz/${otherName}`);
  onValue(refPath, (snapshot) => {
    const otherAnswers = snapshot.val();
    if (otherAnswers) window.otherAnswers = otherAnswers;
  });
};

document.getElementById("quizForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const answers = {};
  for (let i = 1; i <= 5; i++) {
    answers[`q${i}`] = this[`q${i}`].value.trim().toLowerCase();
  }

  const refPath = ref(db, `couples/${coupleCode}/quiz/${yourName}`);
  set(refPath, answers).then(() => {
    if (window.otherAnswers) {
      let score = 0;
      for (let i = 1; i <= 5; i++) {
        if (answers[`q${i}`] === window.otherAnswers[`q${i}`]) score++;
      }
      document.getElementById("resultText").textContent = `❤️ You matched ${score}/5 answers with your partner!`;
    } else {
      document.getElementById("resultText").textContent = "✅ Answers saved! Waiting for your partner to take the quiz.";
    }
  });
});
