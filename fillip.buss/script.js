const buyButtons = document.querySelectorAll('.buy-now-btn');

buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        
        button.innerHTML = "Processing...";
        button.style.backgroundColor = "#ff9f00"; // रंग बदल जाएगा
        
        console.log("Prince's Store: User is going to buy a product!");
    });
});
function searchProduct() {
    let input = document.getElementById('search-input').value.toLowerCase().trim();
    let cards = document.querySelectorAll('.product-card, .elec-card');

    cards.forEach(card => {
        // 1. नाम और डिस्क्रिप्शन दोनों को पकड़ो
        let nameElement = card.querySelector('.product-name, .title-product-name');
        let descElement = card.querySelector('.product-description'); // ये क्लास पक्का कर लेना
        
        let titleText = nameElement ? nameElement.innerText.toLowerCase() : "";
        let descText = descElement ? descElement.innerText.toLowerCase() : "";
        
        // 2. अब चेक करो कि क्या इनपुट टाइटल में है या डिस्क्रिप्शन में
        if (input === "" || titleText.includes(input) || descText.includes(input)) {
            card.style.display = ""; // दिखाओ
        } else {
            card.style.display = "none"; // छुपाओ
        }
    });
}
// Enter key dabane par bhi search kaam karega (ID match: search-input)
document.getElementById('search-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchProduct();
    }
});
// पेज लोड होते ही पुरानी शॉपिंग लिस्ट को वापस लाना
let cartItems = JSON.parse(localStorage.getItem('prinxeCart')) || [];

// पेज लोड होते ही कार्ट का नंबर अपडेट करना
window.onload = function() {
    let cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.innerText = `Cart (${cartItems.length})`;
    }
};
// असली Add to Cart फंक्शन
function addToCart(name, price, img) {
    // 1. एरे में डेटा जोड़ें
    cartItems.push({ name: name, price: price, img: img });

    // 2. Firebase Database में डेटा भेजें
    if (typeof db !== 'undefined') {
        db.collection("cart_activities").add({
            productName: name,
            productPrice: price,
            time: firebase.firestore.FieldValue.serverTimestamp(), // असली टाइम
            status: "added_to_cart"
        })
        .then(() => {
            console.log("Database updated for: " + name);
        })
        .catch((error) => {
            console.error("Database Error: ", error);
        });
    }

    // 3. UI अपडेट करें (बटन और काउंट)
    let cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.innerText = `Cart (${cartItems.length})`;
    }
// सामान एरे में डालने के बाद उसे तिजोरी में सेव करना
localStorage.setItem('prinxeCart', JSON.stringify(cartItems));
    alert(name + " - added to prinXe zeXine cart!/and BUY ✅");
}

// 3. Cart Modal Kholne ka logic
document.getElementById('cart-link').onclick = function(e) {
    e.preventDefault();
    let modal = document.getElementById('cartModal');
    let list = document.getElementById('cartItemsList');
    let totalDisplay = document.getElementById('totalAmount'); // Check karne ke liye

    if(!modal || !list) return; // Agar HTML missing hai to ruk jao

    list.innerHTML = "";
    let total = 0;

    cartItems.forEach((item, index) => {
        list.innerHTML += `
            <div class="cart-item" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                <img src="${item.img}" style="width:50px; height:60px; object-fit:cover; margin-right:10px;">
                <div class="info">
                    <p style="margin:0; font-weight:bold;">${item.name}</p>
                    <p style="margin:0;">₹${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`;
        total += parseInt(item.price);
    });

    if(totalDisplay) totalDisplay.innerText = total; // Tabhi update karo agar element mile
    modal.style.display = "block"; // Modal dikhao
}; 

// 4. Modal Band karein
// Modal Band karne ka surakshit tarika
// Isse error nahi aayega agar button nahi mila to
let closeButton = document.querySelector('.close-btn');
if (closeButton) {
    closeButton.onclick = () => {
        document.getElementById('cartModal').style.display = "none";
    };
}
function checkoutHandler() {
    if (cartItems.length === 0) {
        alert("भाई, कार्ट तो खाली है! पहले कुछ शॉपिंग करो।");
        return;
    }
    
    let message = "नमस्ते prinXe zeXine! मैं ये सामान खरीदना चाहता हूँ:\n\n";
    cartItems.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ₹${item.price}\n`;
    });
    
    let total = document.getElementById('totalAmount').innerText;
    message += `\nकुल राशि: ₹${total}`;
    
    // Aap yahan apna WhatsApp number daal sakte hain (Optional)
    // window.open(`https://wa.me/917065599384?text=${encodeURIComponent(message)}`);
    
    alert("Order Received! \n\n" + message);
}
function removeFromCart(index) {
    // 1. List se item hatao
    cartItems.splice(index, 1);
    
    // 2. Navbar ka count update karo
    let cartLink = document.getElementById('cart-link');
    if(cartLink) {
        cartLink.innerText = `Cart (${cartItems.length})`;
    }
    
    // 3. Cart Modal ko refresh karo taaki item gayab dikhe
    // Iske liye hum dobara click event trigger kar denge
    document.getElementById('cart-link').click();
}
function removeFromCart(index) {
    // 1. एरे से सामान हटाना
    cartItems.splice(index, 1);

    // 2. तिजोरी (localStorage) को अपडेट करना
    localStorage.setItem('prinxeCart', JSON.stringify(cartItems));

    // 3. UI अपडेट करना
    renderCart(); // यह आपकी लिस्ट को दोबारा रेंडर करेगा
    
    let cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.innerText = `Cart (${cartItems.length})`;
    }
}

// Ye function cart ko dikhane ka kaam karega
function renderCart() {
    let list = document.getElementById('cartItemsList');
    let totalDisplay = document.getElementById('totalAmount');
    if (!list) return;

    list.innerHTML = "";
    if (cartItems.length === 0) {
    list.innerHTML = "<p style='text-align:center; padding:20px;'>Arey! Cart khali hai. Kuch mast streetwear add karo! 🔥</p>";
}
    let total = 0;

    cartItems.forEach((item, index) => {
        list.innerHTML += `
            <div class="cart-item" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                <img src="${item.img}" style="width:40px; height:50px; object-fit:cover;">
                <div style="flex:1; margin-left:10px;">
                    <p style="margin:0; font-size:14px; font-weight:bold;">${item.name}</p>
                    <p style="margin:0; font-size:13px;">₹${item.price}</p>
                </div>
                <!-- YAHAN HAI REMOVE BUTTON -->
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer; font-size:18px;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>`;
        total += parseInt(item.price);
    });

    if (totalDisplay) totalDisplay.innerText = total;
}
// Modal ke bahar click karne par band ho jaye
window.onclick = function(event) {
    let modal = document.getElementById('cartModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function openCart() {
    console.log("Cart function triggered!"); // यह चेक करने के लिए है
    var sidebar = document.getElementById('cart-sidebar');
    
    if (sidebar) {
        sidebar.style.right = "0px";
        sidebar.style.display = "block"; 
        displayCart();
    } else {
        alert("Error: 'cart-sidebar' वाली ID नहीं मिली!");
    }
}
// 2. कार्ट बंद करने का फंक्शन
function closeCart() {
    document.getElementById('cart-sidebar').style.right = "-400px";
}

// 3. कार्ट के अंदर सामान दिखाने का फंक्शन
function displayCart() {
    const cartList = document.getElementById('cart-items-list');
    // यहाँ हमने वही नाम इस्तेमाल किया है जो आपके addToCart में है
    let cart = JSON.parse(localStorage.getItem('prinxeCart')) || []; 

    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align:center; color:#888; padding:50px;">Cart khali hai!</p>';
        return;
    }

    cartList.innerHTML = cart.map((item, index) => `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px; color: black;">
            <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
            <div style="flex:1;">
                <p style="margin:0; font-weight:bold; font-size:14px;">${item.name}</p>
                <p style="margin:0; color:#fb641b;">₹${item.price}</p>
            </div>
        </div>
    `).join('');
}
function openCart() {
    console.log("Button Clicked!"); // अगर ये Console में आया, मतलब सब ठीक है
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.style.right = "0px";
    } else {
        console.log("Sidebar ID not found!");
    }
}


// 2. कार्ट बंद करने का फंक्शन
function closeCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.style.right = "-400px";
    }
}

// 3. सामान दिखाने का फंक्शन
function displayCart() {
    const cartList = document.getElementById('cart-items-list');
    const cartData = JSON.parse(localStorage.getItem('prinxeCart')) || []; 

    if (cartData.length === 0) {
        cartList.innerHTML = '<p style="text-align:center; color:#888; padding:20px;">आपका कार्ट खाली है!</p>';
        return;
    }

    cartList.innerHTML = cartData.map((item) => `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px; color:black;">
            <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
            <div style="flex:1;">
                <p style="margin:0; font-weight:bold; font-size:14px;">${item.name}</p>
                <p style="margin:0; color:#fb641b;">₹${item.price}</p>
            </div>
        </div>
    `).join('');
}
// --- CART SYSTEM END ---
// इसे script.js के सबसे नीचे पेस्ट कर दें
window.onload = function() {
    const footerDisclaimer = document.createElement('div');
    footerDisclaimer.innerHTML = `
        <div style="background: #fafafa; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; margin-top: 30px;">
            Prices on Prinxo are curated from top deals. Actual prices on Flipkart may vary.
        </div>
    `;
    document.body.appendChild(footerDisclaimer);
};
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
// डेस्कटॉप के लिए पॉपअप, मोबाइल के लिए रीडायरेक्ट
if (window.innerWidth < 768) {
    signInWithRedirect(auth, provider);
} else {
    signInWithPopup(auth, provider);
}