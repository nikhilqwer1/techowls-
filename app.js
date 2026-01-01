// 🔹 IMPORTS (TOP PE)



let videoStream = null;











import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// 🔹 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCSniqWzpb3JDG824gKCA0emlzW9-4v_FM",
  authDomain: "savepulse-f3902.firebaseapp.com",
  projectId: "savepulse-f3902",
  storageBucket: "savepulse-f3902.appspot.com",
  messagingSenderId: "205447718102",
  appId: "1:205447718102:web:e2b09c2f96cfd3f70e9577"
};

// 🔹 INIT FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Firebase connected ✅");


// ================= SIGNUP =================
window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account Created ✅");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
};


// ================= LOGIN =================
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login Successful ✅");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
};


// ================= AUTH GUARD =================
onAuthStateChanged(auth, user => {
  if (!user && location.pathname.includes("dashboard")) {
    window.location.href = "index.html";
  }
});


// ================= ALERT SYSTEM =================
window.sendAlert = function () {
  navigator.geolocation.getCurrentPosition(pos => {
    alert(
      "🚑 Accident Alert Sent!\nLocation: " +
      pos.coords.latitude + ", " + pos.coords.longitude
    );
  });
};

window.manualAlert = function () {
  alert("🚨 Power Button Double Press Detected!");
  sendAlert();
};

window.startVideo = function () {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      videoStream = stream; // ✅ store stream
      document.getElementById("video").srcObject = stream;
    })
    .catch(err => alert("Camera access denied"));
};


// window.stopVideo = function () {
//   if (videoStream) {
//     videoStream.getTracks().forEach(track => track.stop()); // 🔴 camera off
//     document.getElementById("video").srcObject = null;
//     videoStream = null;
//     alert("Video call ended ❌");
//   }
// };







window.logout = function () {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully ✅");
      window.location.href = "index.html"; // login page
    })
    .catch(error => {
      alert(error.message);
    });
};
