// यह कोड चेक करेगा कि यूजर लॉगिन है या नहीं और UI अपडेट करेगा
firebase.auth().onAuthStateChanged((user) => {
    const userImg = document.getElementById('userPhoto');
    const userName = document.getElementById('userName');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        // 1. अगर User Login है
        if (userName) userName.innerText = user.displayName;
        if (userImg) userImg.src = user.photoURL;
        
        // लॉगिन बटन को छुपाओ और लॉगआउट दिखाओ
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "block";

    } else {
        // 2. अगर कोई लॉगिन नहीं है (Guest Mode)
        if (userName) userName.innerText = "Guest User";
        if (userImg) userImg.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Default Image
        
        // लॉगिन बटन दिखाओ और लॉगआउट छुपाओ
        if (loginBtn) loginBtn.style.display = "block";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
});
// Jab page puri tarah load ho jaye
window.addEventListener('DOMContentLoaded', () => {
    
    // 2 second ke baad welcome message dikhao
    setTimeout(() => {
        const toast = document.getElementById('welcomeToast');
        if(toast) {
            toast.classList.add('show');
        }
    }, 2000);

});

// Message band karne ke liye function
function closeToast() {
    const toast = document.getElementById('welcomeToast');
    if(toast) {
        toast.classList.remove('show');
    }
}
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}
// Search Bar Functionality
const searchInput = document.querySelector('.mega-search input');
const searchBtn = document.querySelector('.mega-search button');

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.includes('baggy') || query.includes('shirt') || query.includes('fashion') || query.includes('jean')) {
        window.location.href = 'fashion.html';
    } else if (query.includes('gadget') || query.includes('tech') || query.includes('electronics') || query.includes('phone')) {
        window.location.href = 'electronics.html';
    } else if (query !== "") {
        // Agar kuch aur search kare toh default fashion par bhej do
        window.location.href = 'fashion.html';
    }
}

// Button click par search
searchBtn.addEventListener('click', performSearch);

// Enter key dabane par search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});
const missionBtn = document.querySelector('.neon-btn');

missionBtn.addEventListener('click', () => {
    alert("prinXo zeXine: Creating a legacy of style and tech for Prince Saw's community! 🚀");
    // Baad mein yahan hum ek mast Model (Pop-up) box banayenge.
});
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // मोबाइल के लिए Popup की जगह Redirect सबसे बेस्ट है
    firebase.auth().signInWithRedirect(provider);
}

// यह हिस्सा Redirect के बाद डेटा सेव करने के लिए ज़रूरी है
firebase.auth().getRedirectResult().then((result) => {
    if (result.user) {
        const user = result.user;
        const db = firebase.firestore();
        
        // आपका पुराना डेटा सेव करने वाला लॉजिक यहाँ आएगा
        db.collection("users").doc(user.uid).set({
            userName: user.displayName,
            userEmail: user.email,
            profilePic: user.photoURL,
            lastLogin: new Date(),
            role: "customer"
        }, { merge: true }).then(() => {
            console.log("प्रिंस भाई, डेटा सेव हो गया!");
            location.reload(); // पेज रिफ्रेश ताकि यूजर लॉगिन दिखे
        });
    }
}).catch((error) => {
    console.error("Redirect Error:", error);
});

        
        // Button update
        const btn = document.getElementById('loginBtn');
        btn.innerHTML = "Logged In";
        btn.style.background = "#4CAF50";
        btn.style.color = "white";

        alert("Welcome, " + user.displayName + "! Your profile is now synced.");
// Logout करने का असली फंक्शन
function googleLogout() {
    firebase.auth().signOut().then(() => {
        alert("Logged out successfully! मिलते हैं प्रिंस भाई!");
        location.reload(); // पेज रिफ्रेश ताकि यूजर डेटा हट जाए
    }).catch((error) => {
        console.error("Logout Error: ", error);
        alert("Logout नहीं हो पाया, कंसोल चेक करें।");
    });
}
// प्रिंस भाई, यह कोड बर्गर मेनू को खोलने और बंद करने के लिए है
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger-menu'); // आपकी बर्गर आइकॉन की क्लास
    const nav = document.querySelector('.nav-links'); // आपकी मेनू लिस्ट की क्लास

    if (burger && nav) {
        burger.addEventListener('click', () => {
            // 'active' क्लास को टॉगल करेगा (CSS में हमने इसे बनाया है)
            nav.classList.toggle('active');
            
            // बटन दबाते ही आइकॉन बदलने के लिए (Optional)
            burger.classList.toggle('toggle-icon');
        });
    }
});
// बैक बटन दबाने पर "अंधेरा" (Blank Screen) फिक्स करने के लिए
window.addEventListener("pageshow", function(event) {
    // अगर पेज ब्राउज़र के कैशे (History) से लोड हो रहा है
    if (event.persisted) {
        // स्क्रीन को वापस दिखाओ
        document.body.style.opacity = "1";
        
        // लोडर लाइन को वापस 0 कर दो
        const loader = document.getElementById('loader-line');
        if (loader) {
            loader.style.width = '0%';
        }
    }
});