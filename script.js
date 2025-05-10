// Use CDN to initialize Firebase because it doesn't work otherwise
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase configuration, get this from your Firebase Console!!


// Initializing Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Hide forms by default
document.getElementById("appointmentForm").style.display = "none";
document.getElementById("signupForm").style.display = "none";
document.getElementById("loginForm").style.display = "none";
document.getElementById("paymentConfirmation").style.display = "none";


// Check for authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        // If user is logged in
        document.getElementById("appointmentForm").style.display = "block";
        document.getElementById("signupForm").style.display = "none";
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("signOutButton").style.display = "inline-block"; // Show Sign Out button
        console.log("User logged in:", user.email);
    } else {
        // if user is not logged in
        document.getElementById("appointmentForm").style.display = "none";
        document.getElementById("signupForm").style.display = "block";
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("signOutButton").style.display = "none"; // Hide Sign Out button
        console.log("User not logged in");
    }
});

// signup
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Signup successful! You can now log in.");
            document.getElementById("signupForm").reset();
            const signupErrorElement = document.getElementById("signupError");
            if (signupErrorElement) {
                signupErrorElement.textContent = ""; // Clear any previous errors
            }
        })
        .catch((error) => {
            // Display Firebase error messages from F12 console
            let errorMessage;
            switch (error.code) {
                case "auth/email-already-in-use":
                    errorMessage = "This email is already in use.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "The email address is badly formatted.";
                    break;
                case "auth/weak-password":
                    errorMessage = "The password must be at least 6 characters.";
                    break;
                default:
                    errorMessage = error.message;
            }
            const signupErrorElement = document.getElementById("signupError");
            if (signupErrorElement) {
                signupErrorElement.textContent = `Error: ${errorMessage}`;
            }
            console.error("Error signing up:", errorMessage);
        });
});

// sign out
document.getElementById("signOutButton").addEventListener("click", function () {
    auth.signOut()
        .then(() => {
            alert("You have been signed out.");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error signing out:", error.message);
        });
});

// login
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login successful!");
            document.getElementById("loginForm").reset();
            document.getElementById("loginError").textContent = ""; // remove any previous errors
        })
        .catch((error) => {
            // display specific Firebase errors
            let errorMessage;
            switch (error.code) {
                case "auth/user-not-found":
                    errorMessage = "No user found with this email.";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "The email address is badly formatted.";
                    break;
                default:
                    errorMessage = error.message;
            }
            document.getElementById("loginError").textContent = `Error: ${errorMessage}`;
            console.error("Error logging in:", errorMessage);
        });
});

// Appointment form submission stuff omg
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("appointmentForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // get the form values
        const appointmentType = document.getElementById("appointmentType").value || "General";
        const animalType = document.getElementById("animalType").value;
        const animalName = document.getElementById("animalName").value;
        const proposedDate = document.getElementById("proposedDate").value;
        const contactEmail = document.getElementById("contactEmail").value;
        const contactPhone = document.getElementById("contactPhone").value;
        const additionalMessage = document.getElementById("additionalMessage").value;
        const billingMethod = document.getElementById("billingMethod").value;
        const billingDetails = document.getElementById("billingDetails").value;

        if (!billingMethod || !billingDetails) {
            alert("Please provide billing information.");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to book an appointment.");
            return;
        }

        // save the appointment to the database
        const appointmentsRef = ref(database, `appointments/${user.uid}`);
        push(appointmentsRef, {
            appointmentType,
            animalType,
            animalName,
            proposedDate,
            contactEmail,
            contactPhone,
            additionalMessage,
            billingMethod,
            billingDetails,
            timestamp: Date.now(),
        })
            .then(() => {
                console.log("Appointment saved successfully");
            
                // i beg show the confirmation ifnormation
                const appointmentForm = document.getElementById("appointmentForm");
                const paymentConfirmation = document.getElementById("paymentConfirmation");
            
                // im beghghing you hide the appintment and show the confirmation instead
                document.getElementById("signupForm").style.display = "none";
                document.getElementById("loginForm").style.display = "none";
                document.getElementById("appointmentForm").style.display = "none";
                // WHY ISNT THIS WORKING, is there something im missing?? must more blood be shed???????
                document.getElementById("paymentConfirmation").style.display = "block";
                // PLEASE show the confirmation details ghg hjjsjsjs
                document.getElementById("confirmationBillingMethod").textContent = billingMethod;
                document.getElementById("confirmationBillingDetails").textContent = billingDetails;
            
                console.log("Payment confirmation displayed");
            })
        });
    });


// Switch to sign up
document.getElementById("toggleToSignup").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("signupForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
});

// Switch to log in 
document.getElementById("toggleToLogin").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
});