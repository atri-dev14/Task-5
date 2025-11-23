/* --- DATA --- */
const products = [
    { id: 1, name: "MacBook Pro M3", cat: "laptops", price: 1999, icon: "💻" },
    { id: 2, name: "iPhone 15 Pro", cat: "phones", price: 999, icon: "📱" },
    { id: 3, name: "Sony XM5", cat: "accessories", price: 349, icon: "🎧" },
    { id: 4, name: "Dell XPS 15", cat: "laptops", price: 1499, icon: "💻" },
    { id: 5, name: "Samsung S25 Ultra", cat: "phones", price: 1199, icon: "📱" },
    { id: 6, name: "Apple Watch", cat: "accessories", price: 399, icon: "⌚" },
    { id: 7, name: "Gaming Mouse", cat: "accessories", price: 89, icon: "🖱️" },
];

let cart = [];

/* --- INIT --- */
// Wait for DOM to load before running scripts
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupScrollAnimation();
});

/* --- RENDER --- */
function renderProducts(data) {
    const grid = document.getElementById('productsGrid');
    
    // Safety check if element exists
    if (!grid) return;

    grid.innerHTML = data.map(p => `
        <div class="product-card hidden">
            <div class="card-img-box">${p.icon}</div>
            <div class="card-details">
                <span class="cat">${p.cat}</span>
                <h3>${p.name}</h3>
                <p class="card-price">$${p.price}</p>
                <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    // Re-trigger observer for new elements to ensure they fade in
    setupScrollAnimation();
}

/* --- CART LOGIC --- */
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const exists = cart.find(item => item.id === id);
    
    if (exists) {
        exists.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCart();
    showToast(`Added ${product.name} to cart`);
}

function updateCart() {
    // Update Badge Count
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.innerText = cart.reduce((a, b) => a + b.qty, 0);
    }

    // Update Total Price
    const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl) {
        cartTotalEl.innerText = '$' + total.toFixed(2);
    }
    
    // Render Cart Items
    const cartList = document.getElementById('cartItems');
    if (!cartList) return;

    if(cart.length === 0) {
        cartList.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        return;
    }

    cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="c-img">${item.icon}</div>
            <div class="c-details">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
                <div class="c-controls">
                    <button class="qty-btn-sm" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn-sm" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCart();
    }
}

/* --- UI FUNCTIONS --- */
function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    
    if (drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = msg;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 3000);
    }
}

function filterProducts() {
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categoryFilter');
    
    if (!searchInput || !categorySelect) return;

    const search = searchInput.value.toLowerCase();
    const cat = categorySelect.value;
    
    const filtered = products.filter(p => {
        return (cat === 'all' || p.cat === cat) && 
               p.name.toLowerCase().includes(search);
    });
    renderProducts(filtered);
}

function handleContact(e) {
    e.preventDefault();
    alert("Thanks for your message! We will get back to you shortly.");
    e.target.reset();
}

function checkout() {
    if(cart.length === 0) {
        return alert("Cart is empty!");
    }
    const totalEl = document.getElementById('cartTotal');
    const total = totalEl ? totalEl.innerText : "$0.00";
    
    alert("Processing order... Total: " + total);
    cart = [];
    updateCart();
    toggleCart();
}

/* --- SCROLL ANIMATION OBSERVER --- */
function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: Stop observing once shown so it stays visible
                // observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
}