import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA0KkOvR5SMiTJ7eDkEUPF5dUIblQQ77tg",
    authDomain: "debate-23e76.firebaseapp.com",
    projectId: "debate-23e76",
    storageBucket: "debate-23e76.firebasestorage.app",
    messagingSenderId: "177290754501",
    appId: "1:177290754501:web:9fc2d84ebcd9d13da2f3ac",
    measurementId: "G-GF8WRPL4LD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginToggle.onclick = () => {
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
    loginForm.classList.remove('d-none');
    signupForm.classList.add('d-none');
};

signupToggle.onclick = () => {
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
    signupForm.classList.remove('d-none');
    loginForm.classList.add('d-none');
};

// Firebase Authentication login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = "app.html";
        })
        .catch((error) => {
            showBootstrapAlert(error.message);
        });
});

// Real join-code verification using Firestore
const verifyBtn = document.getElementById('verifyCodeBtn');
const stepCode = document.getElementById('signupStepCode');
const stepCreds = document.getElementById('signupStepCredentials');

verifyBtn.onclick = async () => {
    verifyBtn.disabled = true;
    const loading = document.getElementById('loading');
    loading.classList.remove('d-none');
    loading.classList.add('d-flex');
    stepCode.classList.add('d-none');

    const joinCodeEntered = document.getElementById('joinCode').value;

    // Artificial delay ~1200ms
    await new Promise(resolve => setTimeout(resolve, 1200));

    const invitesRef = collection(db, 'invites');
    const q = query(invitesRef, where('code', '==', joinCodeEntered));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const inviteDoc = querySnapshot.docs[0];
        const inviteData = inviteDoc.data();
        if (inviteData.used === false) {
            loading.classList.remove('d-flex');
            loading.classList.add('d-none');
            stepCode.classList.add('d-none');
            stepCreds.classList.remove('d-none');
            return;
        }
    }
    loading.classList.remove('d-flex');
    loading.classList.add('d-none');
    stepCode.classList.remove('d-none');
    showBootstrapAlert("Invalid or already used join code");
    verifyBtn.disabled = false;
};

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const joinCodeEntered = document.getElementById('joinCode').value;

    try {
        const invitesRef = collection(db, 'invites');
        const q = query(invitesRef, where('code', '==', joinCodeEntered));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            showBootstrapAlert("Invalid join code");
            return;
        }

        const inviteDoc = querySnapshot.docs[0];
        const inviteData = inviteDoc.data();

        if (inviteData.used) {
            showBootstrapAlert("This join code has already been used");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateDoc(doc(db, 'invites', inviteDoc.id), { used: true });

        window.location.href = "app.html";
    } catch (error) {
        showBootstrapAlert(error.message);
    }
});


function showBootstrapAlert(message, type = "danger") {
    const container = document.getElementById("alert-container");
    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

function setupPasswordToggle(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if (!input || !button) return;

    button.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        button.innerHTML = isPassword ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/></svg>`;
    });
}

setupPasswordToggle("signupPassword", "toggleSignupPassword");
setupPasswordToggle("loginPassword", "toggleLoginPassword");