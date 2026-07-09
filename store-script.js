// Store JavaScript - Complete functionality for e-commerce store

// Global variables
let storeProducts = [];
let filteredProducts = [];
let cart = [];
let wishlist = [];
let currentUser = null;

// Utility function to format BDT currency
function formatBDT(amount) {
    return `৳${amount.toLocaleString('en-IN')}`;
}

// Initialize store when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Store initializing...');
    
    // Force initialize with default products first
    loadDefaultProducts();
    
    // Force render immediately
    filteredProducts = [...storeProducts];
    renderProducts();
    
    // Then load and override with admin products if available
    loadProducts();
    setupEventListeners();
    updateCartCount();
    updateWishlistCount();
    
    // Load current user from localStorage
    const savedUser = localStorage.getItem('storeCurrentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
    initializeStore();
});

function initializeStore() {
    const savedCart = localStorage.getItem('storeCart');
    const savedWishlist = localStorage.getItem('storeWishlist');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);
    
    filteredProducts = [...storeProducts];
    renderProducts();
}

// Load products from admin panel data
function loadProducts() {
    console.log('Loading products...');
    
    // First initialize with default products to ensure store always has products
    loadDefaultProducts();
    
    // Then try to get products from admin panel and merge/override
    const adminProducts = localStorage.getItem('retailhub_products');
    console.log('Admin products from localStorage:', adminProducts ? 'Found' : 'Not found');
    
    if (adminProducts) {
        try {
            const parsedProducts = JSON.parse(adminProducts);
            console.log('Parsed admin products:', parsedProducts.length);
            
            // Override default products with admin products
            const adminStoreProducts = parsedProducts.filter(product => product.status === 'active').map(product => ({
                id: product.id,
                name: product.name,
                price: product.sellPrice,
                originalPrice: product.costPrice,
                category: product.category,
                brand: product.brand,
                description: product.description,
                image: product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
                images: product.images || ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'],
                rating: product.rating || 4.0,
                reviewCount: product.reviewCount || 0,
                stock: product.stock,
                inStock: product.stock > 0,
                features: product.features || [],
                discount: Math.round(((product.sellPrice - product.costPrice) / product.sellPrice) * 100),
                badge: product.stock < 10 ? "sale" : "new"
            }));
            
            if (adminStoreProducts.length > 0) {
                storeProducts = adminStoreProducts;
                console.log('Using admin products:', storeProducts.length);
            } else {
                console.log('No active admin products, keeping defaults');
            }
        } catch (e) {
            console.error('Error loading admin products:', e);
        }
    }
    
    console.log('Final store products count:', storeProducts.length);
    
    // Always update the display after loading
    filteredProducts = [...storeProducts];
    
    // Force render products immediately
    setTimeout(() => {
        renderProducts();
        console.log('Products rendered after timeout');
    }, 100);
}

// Add function to refresh products from admin panel
function refreshProductsFromAdmin() {
    const adminProducts = localStorage.getItem('retailhub_products');
    if (adminProducts) {
        loadProducts();
        renderProducts();
        console.log('Products refreshed from admin panel');
    }
}

// Listen for storage changes to auto-update when admin adds products
window.addEventListener('storage', function(e) {
    if (e.key === 'retailhub_products') {
        refreshProductsFromAdmin();
    }
});

function loadDefaultProducts() {
    // Use same products as admin panel for consistency
    storeProducts = [
        {
            id: 1,
            name: "Samsung Galaxy A54 5G",
            price: 48000,
            originalPrice: 52000,
            category: "electronics",
            brand: "Samsung",
            description: "Latest Samsung Galaxy A54 with 128GB storage, 8GB RAM, triple camera setup.",
            image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
            images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"],
            rating: 4.5,
            reviewCount: 156,
            stock: 25,
            inStock: true,
            features: ["5G Ready", "50MP Camera", "8GB RAM", "128GB Storage"],
            discount: 8,
            badge: "sale"
        },
        {
            id: 2,
            name: "Nike Air Max 270",
            price: 12000,
            originalPrice: 15000,
            category: "fashion",
            brand: "Nike",
            description: "Premium running shoes with Air Max cushioning technology.",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
            images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"],
            rating: 4.3,
            reviewCount: 89,
            stock: 15,
            inStock: true,
            features: ["Air Max Technology", "Breathable Mesh", "Durable Sole"],
            discount: 20,
            badge: "sale"
        },
        {
            id: 3,
            name: "Apple Watch Series 9",
            price: 42000,
            originalPrice: 45000,
            category: "electronics",
            brand: "Apple",
            description: "Latest Apple Watch with advanced health monitoring and GPS tracking.",
            image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
            images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop"],
            rating: 4.8,
            reviewCount: 234,
            stock: 12,
            inStock: true,
            features: ["Health Monitoring", "GPS Tracking", "ECG", "Fitness Tracking"],
            discount: 7,
            badge: "new"
        },
        {
            id: 4,
            name: "Coffee Maker Pro",
            price: 8500,
            originalPrice: 10000,
            category: "home",
            brand: "BrewMaster",
            description: "Automatic drip coffee maker with programmable timer.",
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
            images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop"],
            rating: 4.4,
            reviewCount: 67,
            stock: 8,
            inStock: true,
            features: ["Programmable Timer", "Thermal Carafe", "Auto Shut-off"],
            discount: 15,
            badge: "sale"
        },
        {
            id: 5,
            name: "Himalaya Herbals Skincare Kit",
            price: 1800,
            originalPrice: 2200,
            category: "health",
            brand: "Himalaya",
            description: "Complete skincare kit with natural herbal ingredients.",
            image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
            images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"],
            rating: 4.2,
            reviewCount: 78,
            stock: 20,
            inStock: true,
            features: ["Natural Ingredients", "Complete Kit", "Dermatologist Tested"],
            discount: 18,
            badge: "new"
        },
        {
            id: 6,
            name: "HP Pavilion Laptop",
            price: 65000,
            originalPrice: 70000,
            category: "electronics",
            brand: "HP",
            description: "15.6 inch laptop with Intel Core i5 processor and Windows 11.",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
            images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop"],
            rating: 4.6,
            reviewCount: 145,
            stock: 6,
            inStock: true,
            features: ["Intel Core i5", "8GB RAM", "256GB SSD", "Windows 11"],
            discount: 7,
            badge: "new"
        },
        {
            id: 7,
            name: "Sony WH-1000XM4 Headphones",
            price: 12500,
            originalPrice: 15000,
            category: "electronics",
            brand: "Sony",
            description: "Premium wireless headphones with noise cancellation.",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
            rating: 4.7,
            reviewCount: 156,
            stock: 18,
            inStock: true,
            features: ["Noise Cancellation", "30-hour Battery", "Bluetooth 5.0"],
            discount: 17,
            badge: "new"
        },
        {
            id: 8,
            name: "Women's Handbag",
            price: 4500,
            originalPrice: 6000,
            category: "fashion",
            brand: "StyleCo",
            description: "Stylish women's handbag made from premium synthetic leather with multiple compartments.",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
            images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"],
            rating: 4.6,
            reviewCount: 178,
            stock: 22,
            inStock: true,
            features: ["Premium Synthetic Leather", "Multiple Compartments", "Adjustable Strap", "Water Resistant"],
            discount: 25,
            badge: "sale"
        }
    ];
    console.log('Loaded default products matching admin panel:', storeProducts.length);
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            filterByCategory(category);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge === 'sale' ? 'Sale' : 'New'}</div>` : ''}
                <button class="wishlist-btn ${wishlist.some(item => item.id === product.id) ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatBDT(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatBDT(product.originalPrice)}</span>` : ''}
                    ${product.discount ? `<span class="discount-percent">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="quick-view-btn" onclick="openQuickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star empty"></i>';
    }
    return stars;
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm.length === 0) {
        filteredProducts = [...storeProducts];
    } else {
        filteredProducts = storeProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    renderProducts();
}

function filterByCategory(category) {
    if (category === 'all') {
        filteredProducts = [...storeProducts];
    } else {
        filteredProducts = storeProducts.filter(product => product.category === category);
    }
    renderProducts();
}

// Cart Functions
function addToCart(productId) {
    const product = storeProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

function saveCart() {
    localStorage.setItem('storeCart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = storeProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        showNotification('Added to wishlist!', 'success');
    }
    
    saveWishlist();
    updateWishlistCount();
    renderProducts();
}

function saveWishlist() {
    localStorage.setItem('storeWishlist', JSON.stringify(wishlist));
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// Cart Sidebar Functions
function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    renderCartItems();
    updateCartTotal();
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderCartItems() {
    const cartContent = document.getElementById('cartContent');
    const cartFooter = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn-primary" onclick="closeCart()">Continue Shopping</button>
            </div>
        `;
        cartFooter.style.display = 'none';
        return;
    }
    
    cartContent.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatBDT(item.price)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    cartFooter.style.display = 'block';
}

function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 60 : 0;
    const total = subtotal + deliveryFee;
    
    const cartSubtotal = document.getElementById('cartSubtotal');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartSubtotal) cartSubtotal.textContent = formatBDT(subtotal);
    if (deliveryFeeElement) deliveryFeeElement.textContent = formatBDT(deliveryFee);
    if (cartTotal) cartTotal.textContent = formatBDT(total);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
    updateCartTotal();
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            renderCartItems();
            updateCartTotal();
        }
    }
}

// Checkout Functions
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    closeCart();
    openCheckout();
}

function openCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    renderCheckoutItems();
    updateCheckoutTotal();
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">Qty: ${item.quantity}</span>
            </div>
            <div class="item-price">${formatBDT(item.price * item.quantity)}</div>
        </div>
    `).join('');
}

function updateCheckoutTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 60;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;
    
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutDelivery = document.getElementById('checkoutDelivery');
    const checkoutTax = document.getElementById('checkoutTax');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (checkoutSubtotal) checkoutSubtotal.textContent = formatBDT(subtotal);
    if (checkoutDelivery) checkoutDelivery.textContent = formatBDT(deliveryFee);
    if (checkoutTax) checkoutTax.textContent = formatBDT(tax);
    if (checkoutTotal) checkoutTotal.textContent = formatBDT(total);
}

function placeOrder() {
    const name = document.getElementById('checkoutName').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();
    const city = document.getElementById('checkoutCity').value;
    
    if (!name || !phone || !address || !city) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const orderId = `ORD-${Date.now()}`;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 60;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;
    
    // Create order object
    const order = {
        id: orderId,
        customer: {
            name: name,
            phone: phone,
            email: document.getElementById('checkoutEmail').value || '',
            address: address,
            city: city
        },
        items: [...cart],
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        total: total,
        status: 'pending',
        paymentMethod: document.querySelector('input[name="checkoutPayment"]:checked').value,
        date: new Date().toISOString(),
        orderNumber: orderId
    };
    
    // Save order to admin panel
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    closeCheckout();
    showOrderSuccess(orderId);
}

function showOrderSuccess(orderId) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-check-circle" style="color: #10b981;"></i> Order Placed Successfully!</h2>
            </div>
            <div style="padding: 20px; text-align: center;">
                <p style="margin-bottom: 20px;">Thank you for your order!</p>
                <p style="font-weight: 600; margin-bottom: 20px;">Order ID: ${orderId}</p>
                <p style="margin-bottom: 30px;">You will receive a confirmation call within 30 minutes.</p>
                <button class="btn-primary" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// User Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Demo authentication
    if (email === 'customer@retailhub.com' && password === 'customer123') {
        storeCurrentUser = {
            id: 1,
            name: 'Demo Customer',
            email: email,
            phone: '+880 1234567890'
        };
        
        localStorage.setItem('storeCurrentUser', JSON.stringify(storeCurrentUser));
        updateUserInterface();
        closeUserAccount();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Create new user
    storeCurrentUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone
    };
    
    localStorage.setItem('storeCurrentUser', JSON.stringify(storeCurrentUser));
    updateUserInterface();
    closeUserAccount();
    showNotification('Registration successful!', 'success');
}

function handleLogout() {
    storeCurrentUser = null;
    localStorage.removeItem('storeCurrentUser');
    updateUserInterface();
    closeUserAccount();
    showNotification('Logged out successfully', 'info');
}

function updateUserInterface() {
    const profileTab = document.getElementById('profileTab');
    
    if (storeCurrentUser) {
        profileTab.style.display = 'block';
        
        // Update profile info
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        if (profileName) profileName.textContent = storeCurrentUser.name;
        if (profileEmail) profileEmail.textContent = storeCurrentUser.email;
    } else {
        profileTab.style.display = 'none';
    }
}

function openUserAccount() {
    const modal = document.getElementById('userAccountModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeUserAccount() {
    const modal = document.getElementById('userAccountModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showAccountTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.style.display = 'none');
    
    document.querySelector(`[onclick="showAccountTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}Tab`).style.display = 'block';
}

function openWishlist() {
    const wishlistModal = document.getElementById('wishlistModal');
    wishlistModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    renderWishlistItems();
}

function closeWishlist() {
    const wishlistModal = document.getElementById('wishlistModal');
    wishlistModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderWishlistItems() {
    const wishlistContent = document.getElementById('wishlistContent');
    
    if (wishlist.length === 0) {
        wishlistContent.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Add products you love to your wishlist</p>
                <button class="btn-primary" onclick="closeWishlist()">Continue Shopping</button>
            </div>
        `;
        return;
    }
    
    wishlistContent.innerHTML = `
        <div class="wishlist-grid">
            ${wishlist.map(item => `
                <div class="wishlist-card">
                    <div class="wishlist-image">
                        <img src="${item.image}" alt="${item.name}">
                        <button class="remove-wishlist" onclick="toggleWishlist(${item.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="wishlist-info">
                        <h4>${item.name}</h4>
                        <p class="price">${formatBDT(item.price)}</p>
                        <button class="btn-primary" onclick="addToCart(${item.id}); showNotification('Added to cart!', 'success')">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function openQuickView(productId) {
    showNotification('Quick view feature coming soon!', 'info');
}

function scrollToProducts() {
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
    
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function openTrackOrder() {
    showNotification('Order tracking feature coming soon!', 'info');
}

function openHelp() {
    showNotification('Help center coming soon!', 'info');
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            filterByCategory(category);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    const sortFilter = document.getElementById('sortFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (sortFilter) sortFilter.addEventListener('change', sortProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterByPrice);
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge === 'sale' ? 'Sale' : 'New'}</div>` : ''}
                <button class="wishlist-btn ${wishlist.some(item => item.id === product.id) ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatBDT(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatBDT(product.originalPrice)}</span>` : ''}
                    ${product.discount ? `<span class="discount-percent">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="quick-view-btn" onclick="openQuickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star empty"></i>';
    }
    return stars;
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm.length === 0) {
        filteredProducts = [...storeProducts];
    } else {
        filteredProducts = storeProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    renderProducts();
}

function filterByCategory(category) {
    if (category === 'all') {
        filteredProducts = [...storeProducts];
    } else {
        filteredProducts = storeProducts.filter(product => product.category === category);
    }
    renderProducts();
}

function sortProducts() {
    const sortBy = document.getElementById('sortFilter').value;
    
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            filteredProducts = [...storeProducts];
    }
    renderProducts();
}

function filterByPrice() {
    const priceRange = document.getElementById('priceFilter').value;
    
    if (priceRange === 'all') {
        filteredProducts = [...storeProducts];
    } else {
        const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
        filteredProducts = storeProducts.filter(product => {
            if (max) {
                return product.price >= parseInt(min) && product.price <= parseInt(max);
            } else {
                return product.price >= parseInt(min);
            }
        });
    }
    renderProducts();
}

// Cart Functions
function addToCart(productId) {
    const product = storeProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
    updateCartTotal();
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            renderCartItems();
            updateCartTotal();
        }
    }
}

function saveCart() {
    localStorage.setItem('storeCart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = storeProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        showNotification('Added to wishlist!', 'success');
    }
    
    saveWishlist();
    updateWishlistCount();
    renderProducts();
}

function saveWishlist() {
    localStorage.setItem('storeWishlist', JSON.stringify(wishlist));
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// Cart Sidebar Functions
function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    renderCartItems();
    updateCartTotal();
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderCartItems() {
    const cartContent = document.getElementById('cartContent');
    const cartFooter = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn-primary" onclick="closeCart()">Continue Shopping</button>
            </div>
        `;
        cartFooter.style.display = 'none';
        return;
    }
    
    cartContent.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatBDT(item.price)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    cartFooter.style.display = 'block';
}

function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 60 : 0;
    const total = subtotal + deliveryFee;
    
    const cartSubtotal = document.getElementById('cartSubtotal');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartSubtotal) cartSubtotal.textContent = formatBDT(subtotal);
    if (deliveryFeeElement) deliveryFeeElement.textContent = formatBDT(deliveryFee);
    if (cartTotal) cartTotal.textContent = formatBDT(total);
}

// Checkout Functions
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    closeCart();
    openCheckout();
}

function openCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    renderCheckoutItems();
    updateCheckoutTotal();
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">Qty: ${item.quantity}</span>
            </div>
            <div class="item-price">${formatBDT(item.price * item.quantity)}</div>
        </div>
    `).join('');
}

function updateCheckoutTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 60;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;
    
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutDelivery = document.getElementById('checkoutDelivery');
    const checkoutTax = document.getElementById('checkoutTax');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (checkoutSubtotal) checkoutSubtotal.textContent = formatBDT(subtotal);
    if (checkoutDelivery) checkoutDelivery.textContent = formatBDT(deliveryFee);
    if (checkoutTax) checkoutTax.textContent = formatBDT(tax);
    if (checkoutTotal) checkoutTotal.textContent = formatBDT(total);
}

function placeOrder() {
    const name = document.getElementById('checkoutName').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();
    const city = document.getElementById('checkoutCity').value;
    const paymentMethod = document.querySelector('input[name="checkoutPayment"]:checked')?.value || 'cod';
    
    if (!name || !phone || !address || !city) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const orderId = `ORD-${Date.now()}`;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 60;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;
    
    // Create order object for admin panel
    const order = {
        id: orderId,
        customerName: name,
        customerPhone: phone,
        customerEmail: currentUser?.email || 'guest@retailhub.com',
        shippingAddress: `${address}, ${city}`,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: subtotal + deliveryFee
    };
    
    // Save order to localStorage for admin panel
    const existingOrders = JSON.parse(localStorage.getItem('retailhub_orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('retailhub_orders', JSON.stringify(existingOrders));
    
    // Trigger notification for admin
    const notifications = JSON.parse(localStorage.getItem('retailhub_notifications') || '[]');
    notifications.push({
        id: Date.now(),
        type: 'order',
        title: 'New Order Received',
        orderId: orderId,
        message: `New order #${orderId} from ${name}`,
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('retailhub_notifications', JSON.stringify(notifications));
    
    // Clear cart and close checkout
    cart = [];
    localStorage.setItem('storeCart', JSON.stringify(cart));
    updateCartCount();
    closeCheckout();
    showOrderSuccess(orderId);
    
    return order;
}

function showOrderSuccess(orderId) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-check-circle" style="color: #10b981;"></i> Order Placed Successfully!</h2>
            </div>
            <div style="padding: 20px; text-align: center;">
                <p style="margin-bottom: 20px;">Thank you for your order!</p>
                <p style="font-weight: 600; margin-bottom: 20px;">Order ID: ${orderId}</p>
                <p style="margin-bottom: 30px;">You will receive a confirmation call within 30 minutes.</p>
                <button class="btn-primary" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// User Authentication Functions

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Demo authentication
    if (email === 'customer@retailhub.com' && password === 'customer123') {
        currentUser = {
            id: 1,
            name: 'Demo Customer',
            email: email,
            phone: '+880 1234567890'
        };
        
        localStorage.setItem('storeCurrentUser', JSON.stringify(currentUser));
        updateUserInterface();
        closeUserAccount();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Create new user
    currentUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone
    };
    
    localStorage.setItem('storeCurrentUser', JSON.stringify(currentUser));
    updateUserInterface();
    closeUserAccount();
    showNotification('Registration successful!', 'success');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('storeCurrentUser');
    updateUserInterface();
    closeUserAccount();
    showNotification('Logged out successfully', 'info');
}

function updateUserInterface() {
    const userBtn = document.querySelector('.user-btn');
    const profileTab = document.getElementById('profileTab');
    
    if (currentUser) {
        userBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name}`;
        profileTab.style.display = 'block';
        
        // Update profile info
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        if (profileName) profileName.textContent = currentUser.name;
        if (profileEmail) profileEmail.textContent = currentUser.email;
        
        // Load user's wishlist in profile
        loadProfileWishlist();
    } else {
        userBtn.innerHTML = '<i class="fas fa-user"></i> Account';
        profileTab.style.display = 'none';
    }
}

function loadProfileWishlist() {
    const profileWishlist = document.getElementById('profileWishlist');
    if (!profileWishlist) return;
    
    if (wishlist.length === 0) {
        profileWishlist.innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }
    
    profileWishlist.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="price">${formatBDT(item.price)}</p>
            </div>
            <div class="item-actions">
                <button class="btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
                <button class="btn-secondary" onclick="toggleWishlist(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

// Enhanced Wishlist Functions
function openWishlist() {
    const wishlistModal = document.getElementById('wishlistModal');
    wishlistModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    renderWishlistItems();
}

function closeWishlist() {
    const wishlistModal = document.getElementById('wishlistModal');
    wishlistModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderWishlistItems() {
    const wishlistContent = document.getElementById('wishlistContent');
    
    if (wishlist.length === 0) {
        wishlistContent.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Add products you love to your wishlist</p>
                <button class="btn-primary" onclick="closeWishlist()">Continue Shopping</button>
            </div>
        `;
        return;
    }
    
    wishlistContent.innerHTML = `
        <div class="wishlist-grid">
            ${wishlist.map(item => `
                <div class="wishlist-card">
                    <div class="wishlist-image">
                        <img src="${item.image}" alt="${item.name}">
                        <button class="remove-wishlist" onclick="toggleWishlist(${item.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="wishlist-info">
                        <h4>${item.name}</h4>
                        <p class="price">${formatBDT(item.price)}</p>
                        <button class="btn-primary" onclick="addToCart(${item.id}); showNotification('Added to cart!', 'success')">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function openUserAccount() {
    const modal = document.getElementById('userAccountModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeUserAccount() {
    const modal = document.getElementById('userAccountModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showAccountTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.style.display = 'none');
    
    document.querySelector(`[onclick="showAccountTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}Tab`).style.display = 'block';
}

function scrollToProducts() {
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
    
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Quick View Functions
function openQuickView(productId) {
    const product = storeProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const productDetails = document.getElementById('productDetails');
    
    productDetails.innerHTML = `
        <div class="product-quick-view">
            <div class="product-images">
                <img src="${product.image}" alt="${product.name}" class="main-image">
            </div>
            <div class="product-details-content">
                <div class="product-brand">${product.brand}</div>
                <h2 class="product-title">${product.name}</h2>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-count">(${product.reviewCount} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatBDT(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatBDT(product.originalPrice)}</span>` : ''}
                    ${product.discount ? `<span class="discount-percent">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-description">
                    <p>${product.description}</p>
                </div>
                <div class="product-features">
                    <h4>Key Features:</h4>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="product-stock">
                    <span class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        <i class="fas ${product.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                    </span>
                </div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="addToCart(${product.id}); closeQuickView();">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-secondary" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                        ${wishlist.some(item => item.id === product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                </div>
                <div class="product-reviews-section">
                    <h4>Customer Reviews</h4>
                    <div class="reviews-summary">
                        <div class="rating-breakdown">
                            <span class="average-rating">${product.rating}</span>
                            <div class="stars">${generateStars(product.rating)}</div>
                            <span class="total-reviews">${product.reviewCount} reviews</span>
                        </div>
                    </div>
                    <div class="sample-reviews">
                        ${generateSampleReviews(product.id)}
                    </div>
                    ${currentUser ? `
                        <div class="write-review">
                            <button class="btn-secondary" onclick="openReviewModal(${product.id})">
                                <i class="fas fa-star"></i> Write a Review
                            </button>
                        </div>
                    ` : `
                        <div class="login-to-review">
                            <p>Please <a href="#" onclick="closeQuickView(); openUserAccount();">login</a> to write a review</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function generateSampleReviews(productId) {
    const sampleReviews = [
        {
            name: "Ahmed Rahman",
            rating: 5,
            comment: "Excellent product! Great value for money and fast delivery.",
            date: "2024-01-15"
        },
        {
            name: "Fatima Khan",
            rating: 4,
            comment: "Good quality product. Exactly as described. Recommended!",
            date: "2024-01-10"
        },
        {
            name: "Mohammad Ali",
            rating: 5,
            comment: "Outstanding service and product quality. Will buy again!",
            date: "2024-01-08"
        }
    ];
    
    return sampleReviews.slice(0, 2).map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <span class="reviewer-name">${review.name}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <div class="review-comment">
                <p>${review.comment}</p>
            </div>
        </div>
    `).join('');
}

function openReviewModal(productId) {
    showNotification('Review submission feature coming soon!', 'info');
}

// Payment Gateway Mock Functions
function selectPaymentMethod(method) {
    const paymentMethods = document.querySelectorAll('input[name="checkoutPayment"]');
    paymentMethods.forEach(pm => {
        if (pm.value === method) {
            pm.checked = true;
        }
    });
    
    // Show method-specific instructions
    const instructions = document.getElementById('paymentInstructions');
    if (instructions) {
        switch(method) {
            case 'bkash':
                instructions.innerHTML = `
                    <div class="payment-instruction">
                        <i class="fas fa-mobile-alt"></i>
                        <p>You will receive bKash payment instructions after placing the order.</p>
                    </div>
                `;
                break;
            case 'nagad':
                instructions.innerHTML = `
                    <div class="payment-instruction">
                        <i class="fas fa-mobile-alt"></i>
                        <p>You will receive Nagad payment instructions after placing the order.</p>
                    </div>
                `;
                break;
            case 'card':
                instructions.innerHTML = `
                    <div class="payment-instruction">
                        <i class="fas fa-credit-card"></i>
                        <p>Secure card payment processing available.</p>
                    </div>
                `;
                break;
            default:
                instructions.innerHTML = `
                    <div class="payment-instruction">
                        <i class="fas fa-money-bill"></i>
                        <p>Pay cash when your order is delivered to your doorstep.</p>
                    </div>
                `;
        }
    }
}

function openTrackOrder() {
    showNotification('Order tracking feature coming soon!', 'info');
}

function openHelp() {
    showNotification('Help center coming soon!', 'info');
}
