import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

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