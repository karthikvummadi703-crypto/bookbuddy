import { db, auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const logoutBtn = document.getElementById("logoutBtn");

// Verify active user session authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in user identity ID:", user.uid);
        loadUserSchedules(user.uid);
    } else {
        console.warn("No valid login session found redirecting to registration context...");
        // window.location.href = "/login.html"; 
    }
});

// Fetch schedule entries stored in cloud firestore targeting specific ownership ID
async function loadUserSchedules(userId) {
    try {
        const schedulesRef = collection(db, "schedules");
        const q = query(schedulesRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            console.log("Found Active Schedule Record:", doc.id, doc.data());
        });
    } catch (error) {
        console.error("Failed collection data read operations:", error);
    }
}

// User sign out action event
logoutBtn?.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("Session disconnected successfully");
    }).catch((err) => {
        console.error("Log out failed:", err);
    });
});
