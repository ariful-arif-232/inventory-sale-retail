// Enhanced Inventory Management System with Full CRUD Operations and Admin Authentication

// Global Variables
let products = [];
let currentEditingId = null;
let isLoggedIn = false;
let uploadedImages = [];
let selectedProducts = new Set();
let orders = [];
let currentSale = { items: [], customer: {}, subtotal: 0, discount: 0, tax: 0, total: 0, paymentMethod: 'cash' };
let notifications = [];
let unreadNotifications = 0;

// Admin Credentials (In production, this would be handled server-side)
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// DOM Elements - Will be initialized after DOM loads
let loginModal, loginForm, mainApp, navItems, contentSections;
let addProductBtn, productModal, viewProductModal, bulkDeleteModal, productForm, inventoryTableBody;

// Utility Functions for BDT Currency
function formatBDT(amount) {
    return '৳' + new Intl.NumberFormat('en-IN').format(amount);
}

function calculateProfit(costPrice, sellPrice) {
    const profit = sellPrice - costPrice;
    const margin = ((profit / costPrice) * 100).toFixed(1);
    return { profit: formatBDT(profit), margin };
}

// Enhanced products array with BDT pricing and real product images
const initialProducts = [
    {
        id: 1,
        name: "Samsung Galaxy A54 5G",
        sku: "SGA-054",
        description: "Latest Samsung Galaxy A54 with 128GB storage, 8GB RAM, triple camera setup with 50MP main camera, 5000mAh battery.",
        category: "electronics",
        brand: "Samsung",
        costPrice: 42000,
        sellPrice: 48000,
        stock: 25,
        images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"],
        features: ["5G Ready", "50MP Camera", "8GB RAM", "128GB Storage"],
        rating: 4.5,
        reviewCount: 156,
        minStock: 5,
        status: "active",
        inStock: true,
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
        id: 2,
        name: "Nike Air Max 270",
        brand: "Nike",
        sku: "NAM-270",
        costPrice: 8500,
        sellPrice: 12000,
        stock: 15,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"],
        category: "fashion",
        description: "Premium Nike Air Max 270 running shoes with Air Max technology for superior comfort and style.",
        features: ["Air Max Technology", "Lightweight", "Breathable Mesh", "Durable Sole"],
        rating: 4.7,
        reviewCount: 189,
        minStock: 3,
        status: "active",
        inStock: true,
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
        id: 3,
        name: "Apple Watch Series 9",
        brand: "Apple",
        sku: "AWS-009",
        costPrice: 35000,
        sellPrice: 42000,
        stock: 12,
        images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop"],
        category: "electronics",
        description: "Apple Watch Series 9 with advanced health monitoring, GPS, and cellular connectivity.",
        features: ["Health Monitoring", "GPS + Cellular", "Always-On Display", "Water Resistant"],
        rating: 4.8,
        reviewCount: 156,
        minStock: 2,
        status: "active",
        inStock: true,
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
        id: 4,
        name: "Coffee Maker Pro",
        brand: "BrewMaster",
        sku: "PCM-7431",
        costPrice: 7000,
        sellPrice: 8500,
        stock: 8,
        images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop"],
        category: "home",
        description: "Automatic drip coffee maker with programmable timer.",
        features: ["Programmable Timer", "Thermal Carafe", "Auto Shut-off"],
        rating: 4.3,
        reviewCount: 98,
        minStock: 2,
        status: "active",
        inStock: true,
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
        id: 5,
        name: "Himalaya Herbals Skincare Kit",
        brand: "Himalaya",
        sku: "HHS-001",
        costPrice: 1200,
        sellPrice: 1800,
        stock: 45,
        images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"],
        category: "health",
        description: "Complete Himalaya Herbals skincare kit with natural ingredients for healthy glowing skin.",
        features: ["Natural Ingredients", "Dermatologically Tested", "Complete Kit", "Suitable for All Skin Types"],
        rating: 4.4,
        reviewCount: 267,
        minStock: 10,
        status: "active",
        inStock: true,
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
        id: 6,
        name: "HP Pavilion Laptop",
        brand: "HP",
        sku: "DI-3000",
        costPrice: 60000,
        sellPrice: 65000,
        stock: 6,
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop"],
        category: "electronics",
        description: "15.6 inch laptop with Intel Core i5 processor and Windows 11.",
        features: ["Intel Core i5", "8GB RAM", "256GB SSD", "Windows 11"],
        rating: 4.2,
        reviewCount: 145,
        minStock: 2,
        status: "active",
        inStock: true,
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
        id: 7,
        name: "Fashionable Women's Handbag",
        brand: "Ecstasy",
        sku: "FWH-001",
        costPrice: 2500,
        sellPrice: 3800,
        stock: 20,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"],
        category: "fashion",
        description: "Stylish women's handbag made from premium synthetic leather with multiple compartments.",
        features: ["Premium Synthetic Leather", "Multiple Compartments", "Adjustable Strap", "Water Resistant"],
        rating: 4.6,
        reviewCount: 178,
        minStock: 5,
        status: "active",
        inStock: true,
        lastUpdated: new Date().toISOString().split('T')[0]
    },
    {
        id: 8,
        name: "Wireless Bluetooth Headphones",
        brand: "Sony",
        sku: "WBH-500",
        costPrice: 8000,
        sellPrice: 12500,
        stock: 18,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
        category: "electronics",
        description: "Sony Wireless Bluetooth Headphones with noise cancellation and 30-hour battery life.",
        features: ["Noise Cancellation", "30-hour Battery", "Bluetooth 5.0", "Quick Charge"],
        rating: 4.7,
        reviewCount: 203,
        minStock: 3,
        status: "active",
        inStock: true,
        lastUpdated: new Date().toISOString().split('T')[0]
    }
];

// Initialize DOM elements after page loads
function initializeDOMElements() {
    loginModal = document.getElementById('loginModal');
    loginForm = document.getElementById('loginForm');
    mainApp = document.getElementById('mainApp');
    navItems = document.querySelectorAll('.nav-item');
    contentSections = document.querySelectorAll('.content-section');
    addProductBtn = document.getElementById('addProductBtn');
    productModal = document.getElementById('productModal');
    viewProductModal = document.getElementById('viewProductModal');
    bulkDeleteModal = document.getElementById('bulkDeleteModal');
    productForm = document.getElementById('productForm');
    inventoryTableBody = document.getElementById('inventoryTableBody');
    
    // Add form submission event listener
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted');
            if (currentEditingId) {
                updateProduct();
            } else {
                addProduct();
            }
        });
    }
    
    // Add product button event listener
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openAddProductModal);
    }
}

// Authentication Functions
function initAuth() {
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (username === adminCredentials.username && password === adminCredentials.password) {
            isLoggedIn = true;
            
            if (rememberMe) {
                localStorage.setItem('adminSession', 'true');
            }
            
            if (loginModal) loginModal.classList.remove('active');
            if (mainApp) mainApp.style.display = 'block';
            
            showNotification('Login successful! Welcome to RetailHub Admin.', 'success');
            initializeApp();
        } else {
            showNotification('Invalid credentials. Please try again.', 'error');
            document.getElementById('password').value = '';
        }
    });
    
    // Check for existing session
    if (localStorage.getItem('adminSession') === 'true') {
        isLoggedIn = true;
        if (loginModal) loginModal.classList.remove('active');
        if (mainApp) mainApp.style.display = 'block';
        initializeApp();
    }
}

// Data Management Functions
function loadData() {
    try {
        const savedProducts = localStorage.getItem('retailhub_products');
        const savedOrders = localStorage.getItem('retailhub_orders');
        const savedNotifications = localStorage.getItem('retailhub_notifications');
        
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        } else {
            // Initialize with sample data if no saved data exists
            products = [...initialProducts];
            saveData();
        }
        
        if (savedOrders) {
            orders = JSON.parse(savedOrders);
        } else {
            orders = [];
        }
        
        if (savedNotifications) {
            notifications = JSON.parse(savedNotifications);
            unreadNotifications = notifications.filter(n => !n.read).length;
        } else {
            notifications = [];
            unreadNotifications = 0;
        }
        
        console.log('Data loaded:', { products: products.length, orders: orders.length, notifications: notifications.length });
        updateNotificationBadge();
    } catch (error) {
        console.error('Error loading data:', error);
        products = [...initialProducts];
        orders = [];
        notifications = [];
        unreadNotifications = 0;
        saveData();
    }
}

function saveData() {
    localStorage.setItem('retailhub_products', JSON.stringify(products));
    localStorage.setItem('retailhub_orders', JSON.stringify(orders));
    localStorage.setItem('retailhub_notifications', JSON.stringify(notifications));
}

// Navigation functionality
function initNavigation() {
    if (!navItems) return;
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item
            item.classList.add('active');
            
            // Show corresponding section
            const targetSection = item.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
            }
        });
    });
}

// Enhanced CRUD Operations
function generateProductId() {
    return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

function validateProduct(productData) {
    const errors = {};
    
    if (!productData.name.trim()) errors.name = 'Product name is required';
    if (!productData.sku.trim()) errors.sku = 'SKU is required';
    if (products.some(p => p.sku === productData.sku && p.id !== currentEditingId)) {
        errors.sku = 'SKU already exists';
    }
    if (!productData.category) errors.category = 'Category is required';
    if (!productData.costPrice || productData.costPrice <= 0) errors.costPrice = 'Valid cost price is required';
    if (!productData.sellPrice || productData.sellPrice <= 0) errors.sellPrice = 'Valid selling price is required';
    if (productData.sellPrice <= productData.costPrice) errors.sellPrice = 'Selling price must be higher than cost price';
    if (!productData.stock || productData.stock < 0) errors.stock = 'Valid stock quantity is required';
    
    return errors;
}

function addProduct() {
    const productData = getFormData();
    console.log('Product data:', productData);
    
    // Validate required fields
    if (!productData.name || !productData.sku || !productData.category || !productData.costPrice || !productData.sellPrice || !productData.stock) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Use uploaded images if available, otherwise use default
    const productImages = uploadedImages.length > 0 ? uploadedImages : ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format"];
    
    const newProduct = {
        id: generateProductId(),
        name: productData.name,
        sku: productData.sku,
        description: productData.description,
        category: productData.category,
        brand: productData.brand,
        costPrice: productData.costPrice,
        sellPrice: productData.sellPrice,
        stock: productData.stock,
        minStock: productData.minStock,
        status: productData.status,
        images: productImages,
        features: [],
        rating: 0,
        reviewCount: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    console.log('New product:', newProduct);
    
    products.push(newProduct);
    saveData();
    renderInventoryTable();
    updateInventorySummary();
    closeModal();
    clearForm();
    clearImageUpload();
    showNotification('Product added successfully!', 'success');
    
    console.log('Products array after adding:', products.length);
}

// Notification System Functions
function addNotification(type, title, message, orderId = null) {
    const notification = {
        id: Date.now(),
        type: type, // 'order', 'low_stock', 'system'
        title: title,
        message: message,
        orderId: orderId,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    notifications.unshift(notification);
    unreadNotifications++;
    saveData();
    updateNotificationBadge();
    
    // Auto-remove old notifications (keep last 50)
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (unreadNotifications > 0) {
            badge.textContent = unreadNotifications > 99 ? '99+' : unreadNotifications;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

function openNotificationPanel() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'notificationModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Notifications</h2>
                <button class="modal-close" onclick="closeNotificationModal()">&times;</button>
            </div>
            <div class="modal-body" style="max-height: 500px; overflow-y: auto;">
                <div id="notificationList">
                    ${notifications.length === 0 ? '<p style="text-align: center; color: #666; padding: 20px;">No notifications</p>' : ''}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="markAllNotificationsRead()">Mark All Read</button>
                <button class="btn btn-primary" onclick="closeNotificationModal()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    renderNotifications();
}

function renderNotifications() {
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return;
    
    notificationList.innerHTML = notifications.map(notification => {
        const timeAgo = getTimeAgo(new Date(notification.timestamp));
        const iconClass = notification.type === 'order' ? '🛒' : notification.type === 'low_stock' ? '⚠️' : 'ℹ️';
        
        return `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" style="
                padding: 15px;
                border: 1px solid ${notification.read ? '#e0e0e0' : '#2196F3'};
                margin: 10px 0;
                border-radius: 8px;
                background: ${notification.read ? '#f9f9f9' : '#f0f8ff'};
                cursor: pointer;
            " onclick="handleNotificationClick('${notification.orderId || ''}', ${notification.id})">
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="font-size: 20px;">${iconClass}</span>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; color: #333; font-size: 14px;">${notification.title || 'Order Notification'}</h4>
                        <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">${notification.message}</p>
                        <small style="color: #999; font-size: 11px;">${timeAgo}</small>
                    </div>
                    ${!notification.read ? '<div style="width: 8px; height: 8px; background: #2196F3; border-radius: 50%; margin-top: 5px;"></div>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Handle notification click
function handleNotificationClick(orderId, notificationId) {
    console.log('Notification clicked:', orderId, notificationId);
    
    // Mark as read first
    markNotificationRead(notificationId);
    
    // If it's an order notification, show order details
    if (orderId && orderId !== '' && orderId !== 'undefined') {
        console.log('Opening order details for:', orderId);
        closeNotificationModal();
        setTimeout(() => {
            showOrderDetailsModal(orderId);
        }, 100);
    } else {
        console.log('No valid orderId found');
    }
}

// Show order details modal
function showOrderDetailsModal(orderId) {
    const savedOrders = localStorage.getItem('retailhub_orders');
    if (!savedOrders) {
        showNotification('No orders found', 'error');
        return;
    }
    
    const orders = JSON.parse(savedOrders);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    // Create order details modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2><i class="fas fa-receipt"></i> Order Details - #${order.id}</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div class="order-info" style="margin-bottom: 20px;">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Phone:</strong> ${order.customerPhone}</p>
                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                    <p><strong>Address:</strong> ${order.shippingAddress}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                    <p><strong>Status:</strong> <span class="order-status ${order.status || 'pending'}">${order.status || 'Pending'}</span></p>
                </div>
                
                <div class="order-items" style="margin-bottom: 20px;">
                    <h3>Order Items</h3>
                    <table class="order-items-table" style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Product</th>
                                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
                                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
                                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                                    <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatBDT(item.price)}</td>
                                    <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatBDT(item.total)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr style="background: #f8f9fa; font-weight: bold;">
                                <td colspan="3" style="padding: 10px; border: 1px solid #ddd;">Subtotal:</td>
                                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatBDT(order.subtotal)}</td>
                            </tr>
                            <tr style="background: #f8f9fa;">
                                <td colspan="3" style="padding: 10px; border: 1px solid #ddd;">Delivery Fee:</td>
                                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatBDT(order.deliveryFee)}</td>
                            </tr>
                            <tr style="background: #e3f2fd; font-weight: bold; font-size: 16px;">
                                <td colspan="3" style="padding: 10px; border: 1px solid #ddd;">Total:</td>
                                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatBDT(order.total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div class="order-actions" style="text-align: center; margin-top: 20px;">
                    ${order.status !== 'confirmed' ? `
                        <button class="btn btn-success" onclick="confirmOrderStatus('${order.id}')" style="margin-right: 10px;">
                            <i class="fas fa-check"></i> Confirm Order
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="printOrderReceipt('${order.id}')" style="margin-right: 10px;">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button class="btn btn-danger" onclick="cancelOrderStatus('${order.id}')">
                        <i class="fas fa-times"></i> Cancel Order
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Confirm order status
function confirmOrderStatus(orderId) {
    const savedOrders = localStorage.getItem('retailhub_orders');
    if (!savedOrders) return;
    
    const orders = JSON.parse(savedOrders);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'confirmed';
        orders[orderIndex].confirmedAt = new Date().toISOString();
        localStorage.setItem('retailhub_orders', JSON.stringify(orders));
        
        showNotification('Order confirmed successfully!', 'success');
        
        // Close modal and refresh
        document.querySelector('.modal')?.remove();
    }
}

// Cancel order status
function cancelOrderStatus(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    const savedOrders = localStorage.getItem('retailhub_orders');
    if (!savedOrders) return;
    
    const orders = JSON.parse(savedOrders);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'cancelled';
        orders[orderIndex].cancelledAt = new Date().toISOString();
        localStorage.setItem('retailhub_orders', JSON.stringify(orders));
        
        showNotification('Order cancelled', 'info');
        
        // Close modal and refresh
        document.querySelector('.modal')?.remove();
    }
}

// Print order receipt
function printOrderReceipt(orderId) {
    const savedOrders = localStorage.getItem('retailhub_orders');
    if (!savedOrders) return;
    
    const orders = JSON.parse(savedOrders);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Order #${order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .order-info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
                th { background-color: #f5f5f5; }
                .total-row { font-weight: bold; background-color: #f0f8ff; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>RetailHub</h1>
                <h2>Order Receipt</h2>
                <p>Order #${order.id}</p>
            </div>
            
            <div class="order-info">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${order.customerName}</p>
                <p><strong>Phone:</strong> ${order.customerPhone}</p>
                <p><strong>Address:</strong> ${order.shippingAddress}</p>
                <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleDateString()}</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${formatBDT(item.price)}</td>
                            <td>${formatBDT(item.total)}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td colspan="3"><strong>Subtotal:</strong></td>
                        <td><strong>${formatBDT(order.subtotal)}</strong></td>
                    </tr>
                    <tr>
                        <td colspan="3"><strong>Delivery Fee:</strong></td>
                        <td><strong>${formatBDT(order.deliveryFee)}</strong></td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3"><strong>Total:</strong></td>
                        <td><strong>${formatBDT(order.total)}</strong></td>
                    </tr>
                </tbody>
            </table>
            
            <p style="text-align: center; margin-top: 30px;">
                Thank you for your business!<br>
                For support, call: +880 1700-000000
            </p>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

function markNotificationRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
        notification.read = true;
        unreadNotifications--;
        saveData();
        updateNotificationBadge();
        renderNotifications();
    }
}

function markAllNotificationsRead() {
    notifications.forEach(n => n.read = true);
    unreadNotifications = 0;
    saveData();
    updateNotificationBadge();
    renderNotifications();
}

function closeNotificationModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) modal.remove();
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Check for new store orders periodically
function checkForNewOrders() {
    const storeOrders = localStorage.getItem('store_orders');
    if (storeOrders) {
        try {
            const parsedOrders = JSON.parse(storeOrders);
            const lastChecked = localStorage.getItem('admin_last_order_check') || '0';
            const lastCheckedTime = parseInt(lastChecked);
            
            parsedOrders.forEach(order => {
                if (order.timestamp > lastCheckedTime) {
                    // New order from store
                    addNotification(
                        'order',
                        'New Store Order',
                        `Order #${order.id} from ${order.customer.name} - Total: ${formatBDT(order.total)}`,
                        order.id
                    );
                    
                    // Add to admin orders if not already present
                    if (!orders.find(o => o.id === order.id)) {
                        orders.push({
                            ...order,
                            orderType: 'online',
                            status: 'pending'
                        });
                    }
                }
            });
            
            localStorage.setItem('admin_last_order_check', Date.now().toString());
            saveData();
        } catch (error) {
            console.error('Error checking store orders:', error);
        }
    }
}

function clearImageUpload() {
    uploadedImages = [];
    const imageGallery = document.getElementById('imageGallery');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageGallery) imageGallery.innerHTML = '';
    if (imagePreview) {
        imagePreview.innerHTML = `
            <i class="fas fa-image"></i>
            <p>Click to upload or drag and drop</p>
        `;
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    currentEditingId = id;
    populateForm(product);
    
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    
    if (modalTitle) modalTitle.textContent = 'Edit Product';
    if (submitBtn) submitBtn.textContent = 'Update Product';
    
    openModal();
}

function updateProduct() {
    const productData = getFormData();
    const errors = validateProduct(productData);
    
    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return;
    }
    
    const productIndex = products.findIndex(p => p.id === currentEditingId);
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            ...productData,
            images: uploadedImages.length > 0 ? [...uploadedImages] : products[productIndex].images,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        saveData();
        renderInventoryTable();
        closeModal();
        showNotification('Product updated successfully!', 'success');
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderInventoryTable();
        showNotification('Product deleted successfully!', 'success');
    }
}

// Form Management Functions
function getFormData() {
    return {
        name: document.getElementById('productName')?.value.trim() || '',
        sku: document.getElementById('productSKU')?.value.trim() || '',
        description: document.getElementById('productDescription')?.value.trim() || '',
        category: document.getElementById('productCategory')?.value || '',
        brand: document.getElementById('productBrand')?.value.trim() || '',
        costPrice: parseFloat(document.getElementById('productCostPrice')?.value) || 0,
        sellPrice: parseFloat(document.getElementById('productSellPrice')?.value) || 0,
        stock: parseInt(document.getElementById('productStock')?.value) || 0,
        minStock: parseInt(document.getElementById('minStock')?.value) || 0,
        status: document.getElementById('productStatus')?.value || 'active'
    };
}

function populateForm(product) {
    const fields = [
        'productName', 'productSKU', 'productDescription', 'productCategory',
        'productBrand', 'productCostPrice', 'productSellPrice', 'productStock',
        'minStock', 'productStatus'
    ];
    
    const productKeys = [
        'name', 'sku', 'description', 'category', 'brand', 'costPrice',
        'sellPrice', 'stock', 'minStock', 'status'
    ];
    
    fields.forEach((field, index) => {
        const element = document.getElementById(field);
        if (element) {
            element.value = product[productKeys[index]] || '';
        }
    });
    
    uploadedImages = product.images ? [...product.images] : [];
    updateImageGallery();
    updateProfitMargin();
}

function clearForm() {
    if (productForm) productForm.reset();
    uploadedImages = [];
    updateImageGallery();
    clearFormErrors();
    const profitMargin = document.getElementById('profitMargin');
    if (profitMargin) profitMargin.value = '';
}

function displayFormErrors(errors) {
    clearFormErrors();
    
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(field + 'Error');
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.style.display = 'block';
        }
    });
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// Modal Management Functions
function openModal() {
    if (productModal) {
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (productModal) productModal.classList.remove('active');
    if (viewProductModal) viewProductModal.classList.remove('active');
    if (bulkDeleteModal) bulkDeleteModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form state
    clearForm();
    currentEditingId = null;
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    if (modalTitle) modalTitle.textContent = 'Add New Product';
    if (submitBtn) submitBtn.textContent = 'Add Product';
}

function updateProfitMargin() {
    const costPrice = parseFloat(document.getElementById('productCostPrice')?.value) || 0;
    const sellPrice = parseFloat(document.getElementById('productSellPrice')?.value) || 0;
    
    if (costPrice > 0 && sellPrice > 0) {
        const profit = calculateProfit(costPrice, sellPrice);
        const profitMargin = document.getElementById('profitMargin');
        if (profitMargin) {
            profitMargin.value = `${profit.profit} (${profit.margin}%)`;
        }
    } else {
        const profitMargin = document.getElementById('profitMargin');
        if (profitMargin) profitMargin.value = '';
    }
}

// Image Upload Functions
function updateImageGallery() {
    const gallery = document.getElementById('imageGallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    uploadedImages.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <img src="${image}" alt="Product image">
            <button class="image-remove" onclick="removeImage(${index})">×</button>
        `;
        gallery.appendChild(imageItem);
    });
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImageGallery();
}

// Table Rendering Functions
function renderInventoryTable(filteredProducts = products) {
    if (!inventoryTableBody) return;
    
    inventoryTableBody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        
        // Determine stock level class
        let stockClass = 'in-stock';
        if (product.stock === 0) stockClass = 'out-of-stock';
        else if (product.stock <= (product.minStock || 5)) stockClass = 'low-stock';
        
        const profit = calculateProfit(product.costPrice, product.sellPrice);
        const profitClass = parseFloat(profit.profit.replace('৳', '').replace(',', '')) > 0 ? 'profit-positive' : 'profit-negative';
        
        row.innerHTML = `
            <td>
                <input type="checkbox" class="product-checkbox" value="${product.id}" 
                       onchange="toggleProductSelection(${product.id}, this.checked)">
            </td>
            <td>
                <div class="product-info">
                    <img src="${product.images ? product.images[0] : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop'}" alt="Product">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-brand">${product.brand || ''}</div>
                    </div>
                </div>
            </td>
            <td>${product.sku}</td>
            <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
            <td>
                <span class="stock-level ${stockClass}">${product.stock}</span>
            </td>
            <td>${formatBDT(product.costPrice)}</td>
            <td>${formatBDT(product.sellPrice)}</td>
            <td class="${profitClass}">${profit.profit} (${profit.margin}%)</td>
            <td><span class="status-badge ${product.status}">${product.status.charAt(0).toUpperCase() + product.status.slice(1)}</span></td>
            <td>${product.lastUpdated}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" title="View" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        inventoryTableBody.appendChild(row);
    });
    
    updateInventorySummary();
}

// Selection Management
function toggleProductSelection(id, checked) {
    if (checked) {
        selectedProducts.add(id);
    } else {
        selectedProducts.delete(id);
    }
    updateBulkActionButtons();
    updateSelectAllState();
}

function updateBulkActionButtons() {
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const bulkExportBtn = document.getElementById('bulkExportBtn');
    
    if (bulkDeleteBtn) {
        bulkDeleteBtn.disabled = selectedProducts.size === 0;
    }
    if (bulkExportBtn) {
        bulkExportBtn.disabled = selectedProducts.size === 0;
    }
}

function updateSelectAllState() {
    const selectAllHeader = document.getElementById('selectAllHeader');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    
    if (selectAllHeader) {
        const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
        const someChecked = Array.from(checkboxes).some(cb => cb.checked);
        
        selectAllHeader.checked = allChecked;
        selectAllHeader.indeterminate = someChecked && !allChecked;
    }
}

// Update inventory summary
function updateInventorySummary() {
    const totalProducts = document.getElementById('totalProducts');
    const inStockProducts = document.getElementById('inStockProducts');
    const lowStockProducts = document.getElementById('lowStockProducts');
    const outOfStockProducts = document.getElementById('outOfStockProducts');
    const totalInventoryValue = document.getElementById('totalInventoryValue');
    
    if (totalProducts) totalProducts.textContent = products.length;
    if (inStockProducts) inStockProducts.textContent = products.filter(p => p.stock > 10).length;
    if (lowStockProducts) lowStockProducts.textContent = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    if (outOfStockProducts) outOfStockProducts.textContent = products.filter(p => p.stock === 0).length;
    
    const totalValue = products.reduce((sum, p) => sum + (p.sellPrice * p.stock), 0);
    if (totalInventoryValue) totalInventoryValue.textContent = formatBDT(totalValue);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles if not present
    if (!document.querySelector('.notification-styles')) {
        const style = document.createElement('style');
        style.className = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 300px;
                animation: slideIn 0.3s ease;
            }
            .notification.success { background: #10b981; }
            .notification.error { background: #ef4444; }
            .notification.info { background: #3b82f6; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the application
function initializeApp() {
    initializeDOMElements();
    loadData();
    initNavigation();
    renderInventoryTable();
    updateInventorySummary();
    initializeImageUpload();
    
    // Start checking for new orders every 10 seconds
    setInterval(checkForNewOrders, 10000);
    checkForNewOrders(); // Initial check
    
    console.log('App initialized successfully');
}

// Image Upload Functionality
function initializeImageUpload() {
    const imagePreview = document.getElementById('imagePreview');
    const productImageInput = document.getElementById('productImage');
    const imageGallery = document.getElementById('imageGallery');
    
    if (!imagePreview || !productImageInput || !imageGallery) {
        console.log('Image upload elements not found');
        return;
    }
    
    // Click to upload
    imagePreview.addEventListener('click', () => {
        productImageInput.click();
    });
    
    // File input change
    productImageInput.addEventListener('change', handleImageUpload);
    
    // Drag and drop
    imagePreview.addEventListener('dragover', (e) => {
        e.preventDefault();
        imagePreview.style.backgroundColor = '#f0f8ff';
        imagePreview.style.borderColor = '#2196F3';
    });
    
    imagePreview.addEventListener('dragleave', (e) => {
        e.preventDefault();
        imagePreview.style.backgroundColor = '';
        imagePreview.style.borderColor = '';
    });
    
    imagePreview.addEventListener('drop', (e) => {
        e.preventDefault();
        imagePreview.style.backgroundColor = '';
        imagePreview.style.borderColor = '';
        
        const files = e.dataTransfer.files;
        handleImageFiles(files);
    });
}

function handleImageUpload(e) {
    const files = e.target.files;
    handleImageFiles(files);
}

function handleImageFiles(files) {
    const imageGallery = document.getElementById('imageGallery');
    uploadedImages = []; // Reset uploaded images
    
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                uploadedImages.push(imageUrl);
                
                // Create image preview
                const imageDiv = document.createElement('div');
                imageDiv.className = 'uploaded-image';
                imageDiv.innerHTML = `
                    <img src="${imageUrl}" alt="Product Image ${index + 1}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px; margin: 5px;">
                    <button type="button" onclick="removeUploadedImage(${uploadedImages.length - 1})" style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">×</button>
                `;
                imageDiv.style.position = 'relative';
                imageDiv.style.display = 'inline-block';
                
                imageGallery.appendChild(imageDiv);
                
                // Update preview area
                const imagePreview = document.getElementById('imagePreview');
                if (uploadedImages.length === 1) {
                    imagePreview.innerHTML = `
                        <img src="${imageUrl}" alt="Preview" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px;">
                        <p style="margin-top: 10px;">Click to add more images</p>
                    `;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

function removeUploadedImage(index) {
    uploadedImages.splice(index, 1);
    const imageGallery = document.getElementById('imageGallery');
    imageGallery.innerHTML = '';
    
    // Rebuild gallery
    uploadedImages.forEach((imageUrl, i) => {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'uploaded-image';
        imageDiv.innerHTML = `
            <img src="${imageUrl}" alt="Product Image ${i + 1}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px; margin: 5px;">
            <button type="button" onclick="removeUploadedImage(${i})" style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">×</button>
        `;
        imageDiv.style.position = 'relative';
        imageDiv.style.display = 'inline-block';
        imageGallery.appendChild(imageDiv);
    });
    
    // Update preview
    const imagePreview = document.getElementById('imagePreview');
    if (uploadedImages.length === 0) {
        imagePreview.innerHTML = `
            <i class="fas fa-image"></i>
            <p>Click to upload or drag and drop</p>
        `;
    } else {
        imagePreview.innerHTML = `
            <img src="${uploadedImages[0]}" alt="Preview" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px;">
            <p style="margin-top: 10px;">Click to add more images</p>
        `;
    }
}

// Sales Interface Functions
function openNewSaleModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'newSaleModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>New Sale</h2>
                <button class="modal-close" onclick="closeNewSaleModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="sale-form">
                    <div class="customer-section">
                        <h3>Customer Information</h3>
                        <div class="form-group">
                            <label>Customer Name</label>
                            <input type="text" id="customerName" placeholder="Enter customer name">
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="text" id="customerPhone" placeholder="Enter phone number">
                        </div>
                    </div>
                    <div class="products-section">
                        <h3>Add Products</h3>
                        <div class="product-selection">
                            <select id="productSelect" onchange="addSelectedProductToSale()" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="">Select a product to add...</option>
                            </select>
                        </div>
                        <div id="saleItems" class="sale-items">
                            <h4>Sale Items</h4>
                            <div id="saleItemsList"></div>
                        </div>
                    </div>
                    <div class="sale-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span id="saleSubtotal">${formatBDT(0)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (5%):</span>
                            <span id="saleTax">${formatBDT(0)}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span id="saleTotal">${formatBDT(0)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeNewSaleModal()">Cancel</button>
                <button class="btn btn-primary" onclick="completeSale()">Complete Sale</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    currentSale = { items: [], customer: {}, subtotal: 0, tax: 0, total: 0 };
    
    // Populate product dropdown
    populateProductDropdown();
}

function populateProductDropdown() {
    const productSelect = document.getElementById('productSelect');
    if (!productSelect || !products || products.length === 0) {
        console.log('No products available or dropdown not found');
        return;
    }
    
    // Clear existing options except first
    productSelect.innerHTML = '<option value="">Select a product to add...</option>';
    
    // Add products to dropdown
    products.forEach(product => {
        if (product.stock > 0) {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - ${product.sku} - ${formatBDT(product.sellPrice)} (Stock: ${product.stock})`;
            productSelect.appendChild(option);
        }
    });
}

function addSelectedProductToSale() {
    const productSelect = document.getElementById('productSelect');
    const productId = parseInt(productSelect.value);
    
    if (!productId) return;
    
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) {
        showNotification('Product not available or out of stock', 'error');
        return;
    }
    
    const existingItem = currentSale.items.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Cannot add more items than available stock', 'error');
            return;
        }
    } else {
        currentSale.items.push({
            id: product.id,
            name: product.name,
            price: product.sellPrice,
            quantity: 1,
            stock: product.stock
        });
    }
    
    updateSaleDisplay();
    showNotification('Product added to sale', 'success');
    
    // Reset dropdown
    productSelect.value = '';
}

function closeNewSaleModal() {
    const modal = document.getElementById('newSaleModal');
    if (modal) modal.remove();
    currentSale = { items: [], customer: {}, subtotal: 0, tax: 0, total: 0 };
}

function completeSale() {
    if (currentSale.items.length === 0) {
        showNotification('Please add products to the sale', 'error');
        return;
    }
    
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    
    if (!customerName) {
        showNotification('Please enter customer name', 'error');
        return;
    }
    
    // Create sale/order
    const sale = {
        id: Date.now(),
        customer: {
            name: customerName,
            phone: customerPhone,
            email: '',
            address: ''
        },
        items: [...currentSale.items],
        subtotal: currentSale.subtotal,
        deliveryFee: 0,
        tax: currentSale.tax,
        total: currentSale.total,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        orderType: 'pos'
    };
    
    orders.push(sale);
    saveData();
    
    showNotification('Sale completed successfully!', 'success');
    closeNewSaleModal();
}

function updateSaleDisplay() {
    const itemsList = document.getElementById('saleItemsList');
    itemsList.innerHTML = currentSale.items.map(item => `
        <div class="sale-item">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${formatBDT(item.price)}</span>
            </div>
            <div class="item-controls">
                <button onclick="updateSaleItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateSaleItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="remove-btn" onclick="removeSaleItem(${item.id})">×</button>
            </div>
            <div class="item-total">${formatBDT(item.price * item.quantity)}</div>
        </div>
    `).join('');
    
    // Calculate totals
    currentSale.subtotal = currentSale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    currentSale.tax = currentSale.subtotal * 0.05;
    currentSale.total = currentSale.subtotal + currentSale.tax;
    
    document.getElementById('saleSubtotal').textContent = formatBDT(currentSale.subtotal);
    document.getElementById('saleTax').textContent = formatBDT(currentSale.tax);
    document.getElementById('saleTotal').textContent = formatBDT(currentSale.total);
}

function updateSaleItemQuantity(productId, newQuantity) {
    const item = currentSale.items.find(item => item.id === productId);
    if (!item) return;
    
    if (newQuantity <= 0) {
        removeSaleItem(productId);
        return;
    }
    
    if (newQuantity > item.stock) {
        showNotification('Cannot exceed available stock', 'error');
        return;
    }
    
    item.quantity = newQuantity;
    updateSaleDisplay();
}

function removeSaleItem(productId) {
    currentSale.items = currentSale.items.filter(item => item.id !== productId);
    updateSaleDisplay();
}

function completeSale() {
    if (currentSale.items.length === 0) {
        showNotification('Please add products to the sale', 'error');
        return;
    }
    
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    
    if (!customerName) {
        showNotification('Please enter customer name', 'error');
        return;
    }
    
    // Create order
    const order = {
        id: Date.now(),
        customer: {
            name: customerName,
            phone: customerPhone
        },
        items: [...currentSale.items],
        subtotal: currentSale.subtotal,
        tax: currentSale.tax,
        total: currentSale.total,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
    };
    
    // Update product stock
    currentSale.items.forEach(saleItem => {
        const product = products.find(p => p.id === saleItem.id);
        if (product) {
            product.stock -= saleItem.quantity;
        }
    });
    
    orders.push(order);
    saveData();
    renderInventoryTable();
    
    showNotification('Sale completed successfully!', 'success');
    printReceipt(order);
    closeNewSaleModal();
}

function openAddProductToSaleModal() {
    showNotification('Use the New Sale interface to add products to sales', 'info');
    openNewSaleModal();
}

function exportSalesData() {
    if (orders.length === 0) {
        showNotification('No sales data to export', 'info');
        return;
    }
    
    const csvContent = [
        ['Order ID', 'Customer Name', 'Customer Phone', 'Date', 'Time', 'Items', 'Subtotal', 'Tax', 'Total', 'Status'],
        ...orders.map(order => [
            order.id,
            order.customer.name,
            order.customer.phone || '',
            order.date,
            order.time,
            order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
            order.subtotal,
            order.tax,
            order.total,
            order.status
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Sales data exported successfully!', 'success');
}

function printLastReceipt() {
    if (orders.length === 0) {
        showNotification('No orders to print', 'info');
        return;
    }
    
    const lastOrder = orders[orders.length - 1];
    printReceipt(lastOrder);
}

function printReceipt(order) {
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
        <html>
        <head>
            <title>Receipt - Order #${order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                .order-info { margin: 20px 0; }
                .items { margin: 20px 0; }
                .item { display: flex; justify-content: space-between; margin: 5px 0; }
                .totals { border-top: 1px solid #000; padding-top: 10px; }
                .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
                .final-total { font-weight: bold; font-size: 1.2em; border-top: 1px solid #000; padding-top: 5px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>RetailHub</h2>
                <p>Receipt</p>
            </div>
            <div class="order-info">
                <p><strong>Order ID:</strong> #${order.id}</p>
                <p><strong>Customer:</strong> ${order.customer.name}</p>
                ${order.customer.phone ? `<p><strong>Phone:</strong> ${order.customer.phone}</p>` : ''}
                <p><strong>Date:</strong> ${order.date} ${order.time}</p>
            </div>
            <div class="items">
                <h3>Items:</h3>
                ${order.items.map(item => `
                    <div class="item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${formatBDT(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>${formatBDT(order.subtotal)}</span>
                </div>
                <div class="total-row">
                    <span>Tax (5%):</span>
                    <span>${formatBDT(order.tax)}</span>
                </div>
                <div class="total-row final-total">
                    <span>Total:</span>
                    <span>${formatBDT(order.total)}</span>
                </div>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <p>Thank you for your business!</p>
            </div>
        </body>
        </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
}

// Additional utility functions
function openBulkAddModal() {
    showNotification('Bulk Add functionality coming soon!', 'info');
}

function importProducts() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            showNotification('CSV import functionality coming soon!', 'info');
        }
    };
    input.click();
}

function exportProducts() {
    if (products.length === 0) {
        showNotification('No products to export', 'info');
        return;
    }
    
    const csvContent = [
        ['ID', 'Name', 'SKU', 'Brand', 'Category', 'Cost Price', 'Sell Price', 'Stock', 'Status'],
        ...products.map(product => [
            product.id,
            product.name,
            product.sku,
            product.brand || '',
            product.category,
            product.costPrice,
            product.sellPrice,
            product.stock,
            product.status
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Products exported successfully!', 'success');
}

function exportCatalog() {
    showNotification('Catalog export functionality coming soon!', 'info');
}

// Order Management Functions
function openNewOrderModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'newOrderModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create New Order</h2>
                <button class="modal-close" onclick="closeNewOrderModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="order-form">
                    <div class="customer-details">
                        <h3>Customer Details</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Customer Name *</label>
                                <input type="text" id="orderCustomerName" placeholder="Enter customer name" required>
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="text" id="orderCustomerPhone" placeholder="Enter phone number">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="orderCustomerEmail" placeholder="Enter email address">
                            </div>
                            <div class="form-group">
                                <label>Address</label>
                                <textarea id="orderCustomerAddress" placeholder="Enter delivery address" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="order-products">
                        <h3>Add Products</h3>
                        <div class="product-search">
                            <input type="text" id="orderProductSearch" placeholder="Search products..." onkeyup="searchProductsForOrder()">
                        </div>
                        <div id="orderProductResults" class="product-results"></div>
                        <div id="orderItems" class="order-items">
                            <h4>Order Items</h4>
                            <div id="orderItemsList"></div>
                        </div>
                    </div>
                    <div class="order-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span id="orderSubtotal">${formatBDT(0)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery Fee:</span>
                            <span id="orderDeliveryFee">${formatBDT(60)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (5%):</span>
                            <span id="orderTax">${formatBDT(0)}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span id="orderTotal">${formatBDT(60)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeNewOrderModal()">Cancel</button>
                <button class="btn btn-primary" onclick="createOrder()">Create Order</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    currentSale = { items: [], customer: {}, subtotal: 0, deliveryFee: 60, tax: 0, total: 60 };
}

function closeNewOrderModal() {
    const modal = document.getElementById('newOrderModal');
    if (modal) modal.remove();
    currentSale = { items: [], customer: {}, subtotal: 0, deliveryFee: 60, tax: 0, total: 60 };
}

function searchProductsForOrder() {
    const searchTerm = document.getElementById('orderProductSearch').value.toLowerCase();
    const resultsContainer = document.getElementById('orderProductResults');
    
    if (searchTerm.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
    
    resultsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-result-item" onclick="addProductToOrder(${product.id})">
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>Brand: ${product.brand}</p>
                <p>SKU: ${product.sku}</p>
                <p class="price">${formatBDT(product.sellPrice)}</p>
                <p class="stock">Stock: ${product.stock}</p>
            </div>
        </div>
    `).join('');
}

function addProductToOrder(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) {
        showNotification('Product not available or out of stock', 'error');
        return;
    }
    
    const existingItem = currentSale.items.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Cannot add more items than available stock', 'error');
            return;
        }
    } else {
        currentSale.items.push({
            id: product.id,
            name: product.name,
            price: product.sellPrice,
            quantity: 1,
            stock: product.stock
        });
    }
    
    updateOrderDisplay();
    showNotification('Product added to order', 'success');
}

function updateOrderDisplay() {
    const itemsList = document.getElementById('orderItemsList');
    itemsList.innerHTML = currentSale.items.map(item => `
        <div class="order-item">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${formatBDT(item.price)}</span>
            </div>
            <div class="item-controls">
                <button onclick="updateOrderItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateOrderItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="remove-btn" onclick="removeOrderItem(${item.id})">×</button>
            </div>
            <div class="item-total">${formatBDT(item.price * item.quantity)}</div>
        </div>
    `).join('');
    
    // Calculate totals
    currentSale.subtotal = currentSale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    currentSale.tax = currentSale.subtotal * 0.05;
    currentSale.total = currentSale.subtotal + currentSale.deliveryFee + currentSale.tax;
    
    document.getElementById('orderSubtotal').textContent = formatBDT(currentSale.subtotal);
    document.getElementById('orderTax').textContent = formatBDT(currentSale.tax);
    document.getElementById('orderTotal').textContent = formatBDT(currentSale.total);
}

function updateOrderItemQuantity(productId, newQuantity) {
    const item = currentSale.items.find(item => item.id === productId);
    if (!item) return;
    
    if (newQuantity <= 0) {
        removeOrderItem(productId);
        return;
    }
    
    if (newQuantity > item.stock) {
        showNotification('Cannot exceed available stock', 'error');
        return;
    }
    
    item.quantity = newQuantity;
    updateOrderDisplay();
}

function removeOrderItem(productId) {
    currentSale.items = currentSale.items.filter(item => item.id !== productId);
    updateOrderDisplay();
}

function createOrder() {
    if (currentSale.items.length === 0) {
        showNotification('Please add products to the order', 'error');
        return;
    }
    
    const customerName = document.getElementById('orderCustomerName').value.trim();
    const customerPhone = document.getElementById('orderCustomerPhone').value.trim();
    const customerEmail = document.getElementById('orderCustomerEmail').value.trim();
    const customerAddress = document.getElementById('orderCustomerAddress').value.trim();
    
    if (!customerName) {
        showNotification('Please enter customer name', 'error');
        return;
    }
    
    // Create order
    const order = {
        id: Date.now(),
        customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            address: customerAddress
        },
        items: [...currentSale.items],
        subtotal: currentSale.subtotal,
        deliveryFee: currentSale.deliveryFee,
        tax: currentSale.tax,
        total: currentSale.total,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        orderType: 'online'
    };
    
    orders.push(order);
    saveData();
    renderOrdersTable();
    
    showNotification('Order created successfully!', 'success');
    closeNewOrderModal();
}

function exportOrders() {
    if (orders.length === 0) {
        showNotification('No orders to export', 'info');
        return;
    }
    
    const csvContent = [
        ['Order ID', 'Customer Name', 'Phone', 'Email', 'Address', 'Date', 'Time', 'Items', 'Subtotal', 'Delivery Fee', 'Tax', 'Total', 'Status', 'Type'],
        ...orders.map(order => [
            order.id,
            order.customer.name,
            order.customer.phone || '',
            order.customer.email || '',
            order.customer.address || '',
            order.date,
            order.time,
            order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
            order.subtotal,
            order.deliveryFee || 0,
            order.tax,
            order.total,
            order.status,
            order.orderType || 'pos'
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Orders exported successfully!', 'success');
}

function printOrdersReport() {
    if (orders.length === 0) {
        showNotification('No orders to print', 'info');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => order.date === today);
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
        <html>
        <head>
            <title>Orders Report - ${today}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
                .summary { display: flex; justify-content: space-around; margin: 20px 0; }
                .summary-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                .orders-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .orders-table th, .orders-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .orders-table th { background-color: #f5f5f5; }
                .status-pending { color: #ff9800; }
                .status-completed { color: #4caf50; }
                .status-cancelled { color: #f44336; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>RetailHub - Orders Report</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="summary">
                <div class="summary-card">
                    <h3>Total Orders</h3>
                    <p style="font-size: 24px; font-weight: bold;">${orders.length}</p>
                </div>
                <div class="summary-card">
                    <h3>Today's Orders</h3>
                    <p style="font-size: 24px; font-weight: bold;">${todayOrders.length}</p>
                </div>
                <div class="summary-card">
                    <h3>Total Revenue</h3>
                    <p style="font-size: 24px; font-weight: bold;">${formatBDT(totalRevenue)}</p>
                </div>
                <div class="summary-card">
                    <h3>Today's Revenue</h3>
                    <p style="font-size: 24px; font-weight: bold;">${formatBDT(todayRevenue)}</p>
                </div>
            </div>
            
            <h2>Recent Orders</h2>
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.slice(-20).reverse().map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>${order.customer.name}</td>
                            <td>${order.date} ${order.time}</td>
                            <td>${order.items.length} items</td>
                            <td>${formatBDT(order.total)}</td>
                            <td class="status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div style="text-align: center; margin-top: 40px;">
                <p><em>Report generated by RetailHub Admin Panel</em></p>
            </div>
        </body>
        </html>
    `);
    reportWindow.document.close();
    reportWindow.print();
    
    showNotification('Orders report printed successfully!', 'success');
}

function renderOrdersTable() {
    const tableBody = document.getElementById('salesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = orders.slice(-10).reverse().map(order => `
        <tr>
            <td>
                <div class="order-id">
                    <span class="order-number">#${order.id}</span>
                    <span class="order-type">${order.orderType || 'POS'}</span>
                </div>
            </td>
            <td>
                <div class="customer-info">
                    <span class="customer-name">${order.customer.name}</span>
                    <span class="customer-contact">${order.customer.phone || order.customer.email || ''}</span>
                </div>
            </td>
            <td>${order.date}<br><small>${order.time}</small></td>
            <td>${order.items.length} items</td>
            <td>${formatBDT(order.total)}</td>
            <td><span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" title="View Order" onclick="viewOrder(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Print Receipt" onclick="printReceipt(${JSON.stringify(order).replace(/"/g, '&quot;')})">
                        <i class="fas fa-print"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    showNotification(`Order #${orderId} - ${order.customer.name} - ${formatBDT(order.total)}`, 'info');
}

function openAddProductModal() {
    currentEditingId = null;
    clearForm();
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    if (modalTitle) modalTitle.textContent = 'Add New Product';
    if (submitBtn) submitBtn.textContent = 'Add Product';
    openModal();
}

// Placeholder functions for missing functionality
function viewProduct(id) {
    showNotification('Product view functionality coming soon!', 'info');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize products with default data first
    if (!localStorage.getItem('retailhub_products')) {
        console.log('No products found, initializing with default products');
        products = [...initialProducts];
        saveData();
    }
    
    // Initialize DOM elements first
    initializeDOMElements();
    
    // Initialize authentication
    initAuth();
});
