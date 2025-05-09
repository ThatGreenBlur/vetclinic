// Import Firebase modules via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvluT8_QNTBWRgj8xIPFBaDDseMS96BzU",
  authDomain: "ict-vet-clinic.firebaseapp.com",
  databaseURL: "https://ict-vet-clinic-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ict-vet-clinic",
  storageBucket: "ict-vet-clinic.appspot.com",
  messagingSenderId: "97444328393",
  appId: "1:97444328393:web:307292033493a24b09ae18",
  measurementId: "G-EBDSWZSPT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Handle form submission
document.getElementById("appointmentForm").addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted");

    const title = document.getElementById("title").value;
    const message = document.getElementById("message").value;
    const email = document.getElementById("email").value;

    const appointmentsRef = ref(database, "appointments");
    push(appointmentsRef, {
        title: title,
        message: message,
        email: email,
        timestamp: Date.now()
    })
    .then(() => {
        alert("Appointment created successfully! Please check your email soon for a response.");
        document.getElementById("appointmentForm").reset();
    })
    .catch((error) => {
        console.error("Error creating appointment:", error);
    });
});