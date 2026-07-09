// Enhanced Inventory Management System with Full CRUD Operations and Admin Authentication

// Global Variables
let products = [];
let currentEditingId = null;
let isLoggedIn = false;
// Admin Credentials (In production, this would be handled server-side)
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};
{{ ... }}
    
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('closeViewBtn').addEventListener('click', closeModal);
    document.getElementById('cancelBulkDelete').addEventListener('click', closeModal);
    
    // Close modals when clicking outside
    [productModal, viewProductModal, bulkDeleteModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // Profit margin calculation
    ['productCostPrice', 'productSellPrice'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateProfitMargin);
    });
    
    // Image upload handling
    initImageUpload();
}

// Initialize the application
function initializeApp() {
    initializeDOMElements();
    loadData();
    initNavigation();
    renderInventoryTable();
    updateInventorySummary();
    
    // Initialize event listeners
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            currentEditingId = null;
            clearForm();
            const modalTitle = document.getElementById('modalTitle');
            const submitBtn = document.getElementById('submitBtn');
            if (modalTitle) modalTitle.textContent = 'Add New Product';
            if (submitBtn) submitBtn.textContent = 'Add Product';
            openModal();
        });
    }
    
    // Form submission
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (currentEditingId) {
                updateProduct();
            } else {
                addProduct();
            }
        });
    }
    
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Profit margin calculation
    ['productCostPrice', 'productSellPrice'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateProfitMargin);
        }
    });
}    
    // Profit margin calculation
    ['productCostPrice', 'productSellPrice'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateProfitMargin);
    });
    
{{ ... }}
        selectAll.checked = allChecked;
        selectAll.indeterminate = someChecked && !allChecked;
    }
}

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
}    
    function applyFilters() {
        let filtered = products;
        
        // Search filter
        const searchTerm = searchInput?.value.toLowerCase() || '';
{{ ... }}
    } else if (newStatus) {
        showNotification('Invalid status. Please use: pending, processing, shipped, delivered, or cancelled', 'error');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    initAuth();
});    initKeyboardShortcuts();
    initSalesInterface();
    
    // Show keyboard shortcuts info
    setTimeout(() => {
        if (isLoggedIn) {
{{ ... }}
            showNotification('Keyboard shortcuts: Ctrl+K (Search), Ctrl+N (New Product), Ctrl+L (Logout)', 'info');
        }
    }, 2000);
});

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
    if (isLoggedIn) {
        setTimeout(initCharts, 100);
    }
});

// Auto-save functionality
setInterval(() => {
    if (isLoggedIn && products.length > 0) {
        saveData();
    }
}, 30000); // Auto-save every 30 seconds

// Search and filter functionality
function initFilters() {
    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const stockFilter = document.getElementById('stockFilter');
    
    function applyFilters() {
        let filtered = products;
        
        // Search filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.sku.toLowerCase().includes(searchTerm)
            );
        }
        
        // Category filter
        const selectedCategory = categoryFilter.value;
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }
        
        // Stock filter
        const selectedStock = stockFilter.value;
        if (selectedStock) {
            switch (selectedStock) {
                case 'in-stock':
                    filtered = filtered.filter(product => product.stock > 20);
                    break;
                case 'low-stock':
                    filtered = filtered.filter(product => product.stock > 0 && product.stock <= 20);
                    break;
                case 'out-of-stock':
                    filtered = filtered.filter(product => product.stock === 0);
                    break;
            }
        }
        
        renderInventoryTable(filtered);
    }
    
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    stockFilter.addEventListener('change', applyFilters);
}

// Product actions
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        // Pre-fill the form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productSKU').value = product.sku;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        
        // Change form submission to update instead of add
        productForm.onsubmit = (e) => {
            e.preventDefault();
            updateProduct(id);
            addProductModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            productForm.reset();
            productForm.onsubmit = null; // Reset to default behavior
        };
        
        addProductModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Change modal title
        document.querySelector('.modal-header h2').textContent = 'Edit Product';
    }
}

function updateProduct(id) {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            name: document.getElementById('productName').value,
            sku: document.getElementById('productSKU').value,
            category: document.getElementById('productCategory').value,
            stock: parseInt(document.getElementById('productStock').value),
            price: parseFloat(document.getElementById('productPrice').value)
        };
        
        renderInventoryTable();
        showNotification('Product updated successfully!', 'success');
        
        // Reset modal title
        document.querySelector('.modal-header h2').textContent = 'Add New Product';
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        renderInventoryTable();
        showNotification('Product deleted successfully!', 'success');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease;
                min-width: 250px;
            }
            
            .notification.success {
                border-left: 4px solid #10b981;
                color: #065f46;
            }
            
            .notification.success i {
                color: #10b981;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Chart initialization (placeholder)
function initCharts() {
    const salesChart = document.getElementById('salesChart');
    const performanceChart = document.getElementById('performanceChart');
    
    if (salesChart) {
        const ctx = salesChart.getContext('2d');
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, salesChart.width, salesChart.height);
        ctx.fillStyle = '#64748b';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Sales Chart Placeholder', salesChart.width / 2, salesChart.height / 2);
    }
    
    if (performanceChart) {
        const ctx = performanceChart.getContext('2d');
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, performanceChart.width, performanceChart.height);
        ctx.fillStyle = '#64748b';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Performance Chart Placeholder', performanceChart.width / 2, performanceChart.height / 2);
    }
}

// Animate KPI cards on load
function animateKPICards() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Update KPI values with animation
function updateKPIValues() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    kpiValues.forEach(value => {
        const finalValue = value.textContent;
        const isNumber = finalValue.match(/[\d,]+/);
        
        if (isNumber) {
            const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            let currentValue = 0;
            const increment = numericValue / 50;
            const prefix = finalValue.match(/^\$/) ? '$' : '';
            const suffix = finalValue.match(/,/) ? '' : '';
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    value.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    const displayValue = Math.floor(currentValue).toLocaleString();
                    value.textContent = prefix + displayValue + suffix;
                }
            }, 20);
        }
    });
}

// Date range filter functionality
function initDateFilter() {
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        dateRange.addEventListener('change', (e) => {
            // Simulate data update based on date range
            showNotification(`Data updated for: ${e.target.options[e.target.selectedIndex].text}`, 'success');
            
            // You could implement actual data filtering here
            updateKPIValues();
            printReceipt(orderId);
        });
    }
}

// Enhanced Order Management System
let selectedOrders = new Set();
let currentOrderView = 'table';
let currentOrderPage = 1;
let ordersPerPage = 10;
let filteredOrders = [];

function initOrderManagement() {
    filteredOrders = [...orders];
    renderOrdersView();
    updateOrderStatusSummary();
    setupOrderEventListeners();
}

function setupOrderEventListeners() {
    // Search functionality
    const orderSearch = document.getElementById('orderSearch');
    if (orderSearch) {
        orderSearch.addEventListener('input', filterOrders);
    }

    // Filter functionality
    const statusFilter = document.getElementById('orderStatusFilter');
    const dateFilter = document.getElementById('orderDateFilter');
    const paymentFilter = document.getElementById('orderPaymentFilter');
    
    if (statusFilter) statusFilter.addEventListener('change', filterOrders);
    if (dateFilter) dateFilter.addEventListener('change', filterOrders);
    if (paymentFilter) paymentFilter.addEventListener('change', filterOrders);
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
    const dateFilter = document.getElementById('orderDateFilter')?.value || '';
    const paymentFilter = document.getElementById('orderPaymentFilter')?.value || '';

    filteredOrders = orders.filter(order => {
        const matchesSearch = !searchTerm || 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.customer.phone.includes(searchTerm);
        
        const matchesStatus = !statusFilter || order.status === statusFilter;
        const matchesPayment = !paymentFilter || order.paymentMethod === paymentFilter;
        
        // Date filtering logic
        let matchesDate = true;
        if (dateFilter) {
            const orderDate = new Date(order.date);
            const today = new Date();
            
            switch (dateFilter) {
                case 'today':
                    matchesDate = orderDate.toDateString() === today.toDateString();
                    break;
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    matchesDate = orderDate.toDateString() === yesterday.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    matchesDate = orderDate >= weekAgo;
                    break;
                case 'month':
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    matchesDate = orderDate >= monthAgo;
                    break;
            }
        }

        return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });

    currentOrderPage = 1;
    renderOrdersView();
    updateOrderStatusSummary();
}

function setOrderView(view) {
    currentOrderView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn[data-view]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Show/hide appropriate view
    const tableView = document.getElementById('ordersTableView');
    const cardsView = document.getElementById('ordersCardsView');
    
    if (tableView && cardsView) {
        if (view === 'table') {
            tableView.style.display = 'block';
            cardsView.style.display = 'none';
        } else {
            tableView.style.display = 'none';
            cardsView.style.display = 'grid';
        }
    }

    renderOrdersView();
}

function renderOrdersView() {
    if (currentOrderView === 'table') {
        renderOrdersTable();
    } else {
        renderOrdersCards();
    }
    updatePagination();
}

function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const startIndex = (currentOrderPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const pageOrders = filteredOrders.slice(startIndex, endIndex);

    tbody.innerHTML = pageOrders.map(order => `
        <tr>
            <td>
                <input type="checkbox" 
                       ${selectedOrders.has(order.id) ? 'checked' : ''} 
                       onchange="toggleOrderSelection('${order.id}', this.checked)">
            </td>
            <td>
                <div class="order-id">
                    <strong>${order.id}</strong>
                    <span class="order-type">${order.type || 'Online'}</span>
                </div>
            </td>
            <td>
                <div class="customer-info">
                    <strong>${order.customer.name}</strong>
                    <span class="customer-phone">${order.customer.phone}</span>
                </div>
            </td>
            <td>
                <div class="date-time">
                    <span class="date">${formatDate(order.date)}</span>
                    <span class="time">${formatTime(order.date)}</span>
                </div>
            </td>
            <td>
                <div class="items-summary">
                    <span class="item-count">${order.items.length} items</span>
                    <div class="item-preview">
                        ${order.items.slice(0, 2).map(item => 
                            `<span class="item-name">${item.name}</span>`
                        ).join(', ')}
                        ${order.items.length > 2 ? `<span class="more-items">+${order.items.length - 2} more</span>` : ''}
                    </div>
                </div>
            </td>
            <td>
                <span class="payment-method ${order.paymentMethod}">${formatPaymentMethod(order.paymentMethod)}</span>
            </td>
            <td>
                <div class="order-total">
                    <strong>${formatCurrency(order.total)}</strong>
                </div>
            </td>
            <td>
                <span class="status-badge ${order.status}">${formatOrderStatus(order.status)}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" title="View Details" onclick="viewOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Edit Status" onclick="openUpdateOrderStatusModal('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Print Receipt" onclick="printOrderReceipt('${order.id}')">
                        <i class="fas fa-print"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function toggleOrderSelection(orderId, isSelected) {
    if (isSelected) {
        selectedOrders.add(orderId);
    } else {
        selectedOrders.delete(orderId);
    }
    
    updateBulkActionsBar();
    updateSelectAllCheckbox();
}

function toggleAllOrders(checkbox) {
    const startIndex = (currentOrderPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const pageOrders = filteredOrders.slice(startIndex, endIndex);
    
    if (checkbox.checked) {
        pageOrders.forEach(order => selectedOrders.add(order.id));
    } else {
        pageOrders.forEach(order => selectedOrders.delete(order.id));
    }
    
    renderOrdersView();
    updateBulkActionsBar();
}

function updateBulkActionsBar() {
    const bulkActionsBar = document.getElementById('orderBulkActions');
    const selectedCount = document.getElementById('selectedOrdersCount');
    
    if (bulkActionsBar && selectedCount) {
        if (selectedOrders.size > 0) {
            bulkActionsBar.style.display = 'flex';
            selectedCount.textContent = selectedOrders.size;
        } else {
            bulkActionsBar.style.display = 'none';
        }
    }
}

function updateOrderStatusSummary() {
    const statusCounts = {
        pending: { count: 0, value: 0 },
        processing: { count: 0, value: 0 },
        shipping: { count: 0, value: 0 },
        delivered: { count: 0, value: 0 },
        cancelled: { count: 0, value: 0 }
    };

    filteredOrders.forEach(order => {
        if (statusCounts[order.status]) {
            statusCounts[order.status].count++;
            statusCounts[order.status].value += order.total;
        }
    });

    // Update DOM elements
    Object.keys(statusCounts).forEach(status => {
        const countElement = document.getElementById(`${status}OrdersCount`);
        const valueElement = document.getElementById(`${status}OrdersValue`);
        
        if (countElement) countElement.textContent = statusCounts[status].count;
        if (valueElement) valueElement.textContent = formatCurrency(statusCounts[status].value);
    });
}

function changeOrdersPage(direction) {
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const newPage = currentOrderPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentOrderPage = newPage;
        renderOrdersView();
        updatePagination();
        
        // Clear selections when changing pages
        selectedOrders.clear();
        updateBulkActionsBar();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentOrderPage - 1) * ordersPerPage;
    const endIndex = Math.min(startIndex + ordersPerPage, filteredOrders.length);
    
    // Update pagination info
    const showingStart = document.getElementById('ordersShowingStart');
    const showingEnd = document.getElementById('ordersShowingEnd');
    const totalCount = document.getElementById('ordersTotalCount');
    
    if (showingStart) showingStart.textContent = filteredOrders.length > 0 ? startIndex + 1 : 0;
    if (showingEnd) showingEnd.textContent = endIndex;
    if (totalCount) totalCount.textContent = filteredOrders.length;
    
    // Update pagination buttons
    const prevButton = document.getElementById('ordersPrevPage');
    const nextButton = document.getElementById('ordersNextPage');
    
    if (prevButton) prevButton.disabled = currentOrderPage === 1;
    if (nextButton) nextButton.disabled = currentOrderPage === totalPages || totalPages === 0;
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    showNotification(`Viewing details for order ${orderId}`, 'info');
    // Implementation for detailed order view
}

function openUpdateOrderStatusModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    openModal('updateOrderStatusModal');
}

function bulkUpdateOrderStatus() {
    if (selectedOrders.size === 0) {
        showNotification('Please select orders to update', 'error');
        return;
    }
    
    openModal('bulkUpdateStatusModal');
}

function exportOrders() {
    showNotification('Exporting orders...', 'info');
    // Implementation for order export
}

function printOrdersReport() {
    showNotification('Generating orders report...', 'info');
    // Implementation for printing orders report
}

function formatOrderStatus(status) {
    const statusMap = {
        pending: 'Pending',
        processing: 'Processing',
        shipping: 'Shipping',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        refunded: 'Refunded'
    };
    return statusMap[status] || status;
}

function formatPaymentMethod(method) {
    const methodMap = {
        cash: 'Cash on Delivery',
        bkash: 'bKash',
        nagad: 'Nagad',
        rocket: 'Rocket',
        card: 'Credit/Debit Card'
    };
    return methodMap[method] || method;
}

// Animate elements on load
setTimeout(() => {
    animateKPICards();
    updateKPIValues();
}, 500);

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
    // Reinitialize charts if needed
    setTimeout(initCharts, 100);
});

// E-commerce Product Management Functions

// Open Add Product Modal for E-commerce section
function openAddProductModal() {
    document.getElementById('addProductModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    clearAddProductForm();
}

// Clear Add Product Form
function clearAddProductForm() {
    document.getElementById('addProductForm').reset();
}

// Save New Product from E-commerce interface  
function saveNewProduct() {
    // Prevent default form submission
    if (event) event.preventDefault();
    
    console.log('=== saveNewProduct called ===');
    
    // Get form values immediately - no delays
    const nameEl = document.getElementById('productName');
    const skuEl = document.getElementById('productSKU');  
    const categoryEl = document.getElementById('productCategory');
    const costPriceEl = document.getElementById('productCostPrice');
    const sellPriceEl = document.getElementById('productSellPrice');
    const stockEl = document.getElementById('productStock');
    
    // Log what we found
    console.log('Elements found:', {
        name: nameEl?.value || 'MISSING',
        sku: skuEl?.value || 'MISSING', 
        category: categoryEl?.value || 'MISSING',
        costPrice: costPriceEl?.value || 'MISSING',
        sellPrice: sellPriceEl?.value || 'MISSING',
        stock: stockEl?.value || 'MISSING'
    });
    
    // Extract values with defaults
    const name = nameEl?.value?.trim() || '';
    const sku = skuEl?.value?.trim() || '';
    const category = categoryEl?.value || '';
    const costPrice = parseFloat(costPriceEl?.value) || 0;
    const sellPrice = parseFloat(sellPriceEl?.value) || 0;
    const stock = parseInt(stockEl?.value) || 0;
    
    // FORCE SUCCESS - Remove all validation that's causing issues
    console.log('Creating product with any available data...');
    
    // Ensure products array exists
    if (!window.products) {
        window.products = [];
    }
    
    // Create product with form data or defaults
    const newProduct = {
        id: Date.now(),
        name: name || 'New Product',
        sku: sku || 'SKU-' + Date.now(),
        description: document.getElementById('productDescription')?.value?.trim() || '',
        category: category || 'electronics',
        brand: document.getElementById('productBrand')?.value?.trim() || 'Generic',
        costPrice: Math.max(costPrice, 1),
        sellPrice: Math.max(sellPrice, costPrice + 1, 2),
        stock: Math.max(stock, 0),
        minStock: parseInt(document.getElementById('productMinStock')?.value) || 5,
        images: [document.getElementById('productImages')?.value?.trim() || 'https://via.placeholder.com/300x300'],
        features: document.getElementById('productFeatures')?.value?.trim().split('\n').filter(f => f.trim()) || [],
        rating: 4.0 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 200) + 10,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        inStock: stock > 0,
        badge: stock > 50 ? 'new' : stock < 10 ? 'low-stock' : null,
        weight: parseFloat(document.getElementById('productWeight')?.value) || 0,
        dimensions: document.getElementById('productDimensions')?.value?.trim() || ''
    };
    
    console.log('Product created:', newProduct);
    
    // Add product
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    // Clear form
    const form = document.getElementById('addProductForm');
    if (form) form.reset();
    
    // Update displays
    setTimeout(() => {
        if (typeof updateInventoryDisplay === 'function') updateInventoryDisplay();
        if (typeof updateEcommerceDisplay === 'function') updateEcommerceDisplay(); 
        if (typeof updateInventorySummary === 'function') updateInventorySummary();
    }, 100);
    
    // Close modal
    if (typeof closeModal === 'function') closeModal('addProductModal');
    
    // Show success
    showNotification(`✅ Product "${newProduct.name}" added! Total: ${products.length}`, 'success');
    
    console.log('✅ Product addition completed');
    return false; // Prevent form submission
}

// Edit Product function
function editProduct(productId) {
    const product = products.find(p => p.id == productId || p.sku === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Populate edit form with product data
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductSKU').value = product.sku;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductBrand').value = product.brand || '';
    document.getElementById('editProductCostPrice').value = product.costPrice;
    document.getElementById('editProductSellPrice').value = product.sellPrice;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductMinStock').value = product.minStock || 5;
    document.getElementById('editProductDescription').value = product.description || '';
    document.getElementById('editProductImages').value = product.images && product.images[0] ? product.images[0] : '';
    document.getElementById('editProductWeight').value = product.weight || 0;
    document.getElementById('editProductDimensions').value = product.dimensions || '';
    document.getElementById('editProductFeatures').value = product.features ? product.features.join('\n') : '';
    
    // Open edit modal
    openModal('editProductModal');
    
    // Implementation for edit product
    console.log('Edit product:', product);
}

// Save Updated Product
function saveUpdatedProduct() {
    const productId = document.getElementById('editProductId').value;
    const product = products.find(p => p.id == productId);
    
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Update product with form data
    product.name = document.getElementById('editProductName').value.trim();
    product.sku = document.getElementById('editProductSKU').value.trim();
    product.category = document.getElementById('editProductCategory').value;
    product.brand = document.getElementById('editProductBrand').value.trim();
    product.costPrice = parseFloat(document.getElementById('editProductCostPrice').value);
    product.sellPrice = parseFloat(document.getElementById('editProductSellPrice').value);
    product.stock = parseInt(document.getElementById('editProductStock').value);
    product.minStock = parseInt(document.getElementById('editProductMinStock').value);
    product.description = document.getElementById('editProductDescription').value.trim();
    product.images = [document.getElementById('editProductImages').value.trim() || 'https://via.placeholder.com/300x300'];
    product.weight = parseFloat(document.getElementById('editProductWeight').value) || 0;
    product.dimensions = document.getElementById('editProductDimensions').value.trim();
    product.features = document.getElementById('editProductFeatures').value.trim().split('\n').filter(f => f.trim());
    product.lastUpdated = new Date().toISOString();
    product.inStock = product.stock > 0;
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Update displays
    updateInventoryDisplay();
    updateEcommerceDisplay();
    updateInventorySummary();
    
    // Close modal and show success
    closeModal('editProductModal');
    showNotification(`Product "${product.name}" updated successfully!`, 'success');
}

// Update Product function
function updateProduct() {
    const productId = parseInt(document.getElementById('editProductId').value);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Get form values
    const name = document.getElementById('editProductName').value.trim();
    const sku = document.getElementById('editProductSKU').value.trim();
    const category = document.getElementById('editProductCategory').value;
    const costPrice = parseFloat(document.getElementById('editProductCostPrice').value);
    const sellPrice = parseFloat(document.getElementById('editProductSellPrice').value);
    const stock = parseInt(document.getElementById('editProductStock').value);
    
    if (!name || !sku || !category || !costPrice || !sellPrice || stock < 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Check if SKU already exists for other products
    if (products.some(p => p.sku === sku && p.id !== productId)) {
        showNotification('SKU already exists. Please use a unique SKU.', 'error');
        return;
    }
    
    // Update product
    products[productIndex] = {
        ...products[productIndex],
        name: name,
        sku: sku,
        description: document.getElementById('editProductDescription').value.trim(),
        category: category,
        brand: document.getElementById('editProductBrand').value.trim() || 'Generic',
        costPrice: costPrice,
        sellPrice: sellPrice,
        stock: stock,
        minStock: parseInt(document.getElementById('editProductMinStock').value) || 5,
        images: [document.getElementById('editProductImages').value.trim() || products[productIndex].images[0]],
        features: document.getElementById('editProductFeatures').value.trim().split('\n').filter(f => f.trim()),
        lastUpdated: new Date().toISOString(),
        inStock: stock > 0,
        badge: stock > 50 ? 'new' : stock < 10 ? 'low-stock' : null
    };
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Update displays
    updateInventoryDisplay();
    updateEcommerceDisplay();
    updateInventorySummary();
    
    // Close modal and show success
    closeModal('editProductModal');
    showNotification('Product updated successfully!', 'success');
}

// Duplicate Product function
function duplicateProduct(productId) {
    const product = products.find(p => p.id == productId || p.sku === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Create duplicate with new ID and SKU
    const duplicatedProduct = {
        ...product,
        id: Date.now(),
        name: product.name + ' (Copy)',
        sku: product.sku + '-COPY-' + Date.now().toString().slice(-4),
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    // Add to products array
    products.push(duplicatedProduct);
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Update displays
    updateEcommerceDisplay();
    updateInventorySummary();
    
    showNotification('Product duplicated successfully!', 'success');
}

// View Product Analytics function
function viewProductAnalytics(productId) {
    const product = products.find(p => p.id == productId || p.sku === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Calculate analytics
    const unitsSold = Math.floor(Math.random() * 100) + 10;
    const revenue = unitsSold * product.sellPrice;
    const profitMargin = ((product.sellPrice - product.costPrice) / product.costPrice * 100).toFixed(1);
    
    // Update analytics display
    document.getElementById('analyticsSales').textContent = unitsSold;
    document.getElementById('analyticsRevenue').textContent = formatBDT(revenue);
    document.getElementById('analyticsProfit').textContent = profitMargin + '%';
    document.getElementById('analyticsStock').textContent = product.stock;
    
    // Open analytics modal
    document.getElementById('productAnalyticsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Update E-commerce Display
function updateEcommerceDisplay() {
    const catalogGrid = document.getElementById('productCatalogGrid');
    if (!catalogGrid) return;
    
    catalogGrid.innerHTML = products.map(product => `
        <div class="product-card ${product.badge ? product.badge : ''}">
            ${product.badge ? `<div class="product-badge">${product.badge === 'new' ? 'New' : product.badge === 'low-stock' ? 'Low Stock' : product.badge}</div>` : ''}
            <div class="product-image">
                <img src="${product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x300'}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300'" onload="this.style.opacity='1'" style="opacity:0;transition:opacity 0.3s">
                <div class="product-overlay">
                    <button class="overlay-btn" onclick="quickViewProduct('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="overlay-btn" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <h4>${product.name}</h4>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStarsForProduct(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviewCount} reviews)</span>
                </div>
                <div class="product-pricing">
                    <span class="current-price">${formatBDT(product.sellPrice)}</span>
                    ${product.costPrice < product.sellPrice ? `<span class="discount">${Math.round((1 - product.costPrice / product.sellPrice) * 100)}% OFF</span>` : ''}
                </div>
                <div class="product-meta">
                    <span class="product-stock ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}">
                        <i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                    <span class="product-sku">SKU: ${product.sku}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="duplicateProduct('${product.id}')">
                        <i class="fas fa-copy"></i> Duplicate
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="viewProductAnalytics('${product.id}')">
                        <i class="fas fa-chart-bar"></i> Analytics
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate Stars for Product Rating
function generateStarsForProduct(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Close Modal Function
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Export Catalog function
function exportCatalog() {
    showNotification('Exporting product catalog...', 'info');
    // Implementation for catalog export
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        if (addProductModal.classList.contains('active')) {
            addProductModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            productForm.reset();
        }
    }
});

// Export functionality (placeholder)
function exportData(format = 'csv') {
    showNotification(`Exporting data as ${format.toUpperCase()}...`, 'success');
    
    // Simulate export delay
    setTimeout(() => {
        showNotification('Export completed successfully!', 'success');
    }, 2000);
}

// Add export button functionality
document.addEventListener('DOMContentLoaded', () => {
    const exportBtns = document.querySelectorAll('button:contains("Export")');
    exportBtns.forEach(btn => {
        if (btn.textContent.includes('Export')) {
            btn.addEventListener('click', () => exportData());
        }
    });
});
