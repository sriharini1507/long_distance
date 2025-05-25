import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getStorage, ref as sRef, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  getDatabase, ref, set, push, onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ✅ Firebase Config
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
const storage = getStorage(app);

// ✅ Upload photo with caption
window.uploadPhoto = async function () {
  const coupleCode = localStorage.getItem("coupleCode");
  const file = document.getElementById("photoFile").files[0];
  const caption = document.getElementById("caption").value.trim();

  if (!file || !coupleCode) {
    alert("Please select a file and ensure you're logged in.");
    return;
  }

  const storageRef = sRef(storage, `${coupleCode}/photos/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const photoRef = push(ref(db, `couples/${coupleCode}/photos`));
  await set(photoRef, { url, caption });

  document.getElementById("photoFile").value = "";
  document.getElementById("caption").value = "";
};

// ✅ Load gallery from Firebase
window.loadGallery = function () {
  const coupleCode = localStorage.getItem("coupleCode");
  const photoRef = ref(db, `couples/${coupleCode}/photos`);
  const gallery = document.getElementById("photoGallery");

  onValue(photoRef, (snapshot) => {
    gallery.innerHTML = "";
    snapshot.forEach((child) => {
      const { url, caption } = child.val();
      const card = document.createElement("div");
      card.className = "photo-card";
      card.innerHTML = `
        <img src="${url}" alt="photo" />
        <p>${caption || ""}</p>
      `;
      gallery.appendChild(card);
    });
  });
};
