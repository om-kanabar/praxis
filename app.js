import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

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

const auth = getAuth(app);

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "index.html";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const editorContainer = document.getElementById('cardEditor');
    if (editorContainer) {
        // Adjusted font size options for practical use
        var sizeWhitelist = [
            '8px','10px','12px','14px','16px','18px','20px','24px','28px','32px','36px','40px','44px','48px'
        ];

        // Register Size style with the whitelist
        var Size = Quill.import('attributors/style/size');
        Size.whitelist = sizeWhitelist;
        Quill.register(Size, true);

        // Initialize Quill with adjusted sizes
        var quill = new window.Quill('#cardEditor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'size': sizeWhitelist }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['link']
                ]
            }
        });

        // Hide the dropdown if needed
        const sizeDropdown = document.querySelector('.ql-size');
        if (sizeDropdown) {
            sizeDropdown.style.display = "none";
        }
    }

    // Sidebar section switching
    const navLinks = document.querySelectorAll('.side-nav .nav-link[data-target]');
    const sections = document.querySelectorAll('section');

    function showSection(sectionId) {
        sections.forEach(sec => sec.style.display = 'none');
        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.style.display = '';
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('data-target') === sectionId);
        });
        history.replaceState(null, '', `#${sectionId}`);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            showSection(targetId);
        });
    });

    const initialSectionId = window.location.hash ? window.location.hash.substring(1) : sections[0].id;
    showSection(initialSectionId);
});
