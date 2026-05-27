/* ===================================
   BookStore - Shopping Cart Management
   =================================== */

/**
 * Add item to cart
 * @param {number} bookId - ID of the book
 * @param {number} quantity - Quantity to add
 */
function addToCart(bookId, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Get book details from data
        const book = books.find(b => b.id === bookId);
        if (book) {
            cart.push({
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                image: book.image,
                quantity: quantity
            });
        }
    }
    
    saveCart(cart);
    updateCartBadge();
    showToast('Book added to cart!', 'success');
}

/**
 * Remove item from cart
 * @param {number} bookId - ID of the book to remove
 */
function removeFromCart(bookId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== bookId);
    saveCart(cart);
    updateCartBadge();
    showToast('Book removed from cart', 'info');
}

/**
 * Update item quantity in cart
 * @param {number} bookId - ID of the book
 * @param {number} newQuantity - New quantity
 */
function updateQuantity(bookId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === bookId);
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(bookId);
        } else {
            item.quantity = newQuantity;
            saveCart(cart);
            updateCartBadge();
        }
    }
}

/**
 * Calculate cart subtotal
 * @returns {number} Subtotal amount
 */
function calculateSubtotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Calculate shipping cost
 * @param {number} subtotal - Cart subtotal
 * @returns {number} Shipping cost
 */
function calculateShipping(subtotal) {
    // Free shipping over ₹500
    return subtotal >= 500 ? 0 : 50;
}

/**
 * Calculate tax
 * @param {number} subtotal - Cart subtotal
 * @returns {number} Tax amount
 */
function calculateTax(subtotal) {
    // 18% GST
    return subtotal * 0.18;
}

/**
 * Calculate cart total
 * @returns {number} Total amount
 */
function calculateTotal() {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const tax = calculateTax(subtotal);
    return subtotal + shipping + tax;
}

/**
 * Save cart to localStorage
 * @param {Array} cart - Cart items
 */
function saveCart(cart) {
    localStorage.setItem('bookstore_cart', JSON.stringify(cart));
}

/**
 * Load cart from localStorage
 * @returns {Array} Cart items
 */
function loadCart() {
    return getCart();
}

/**
 * Clear entire cart
 */
function clearCart() {
    localStorage.removeItem('bookstore_cart');
    updateCartBadge();
    showToast('Cart cleared', 'info');
}

/**
 * Get cart item count
 * @returns {number} Total number of items
 */
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Additional cart functions will be added in Phase 6

// Made with Bob

/* ===================================
   CART PAGE FUNCTIONALITY
   =================================== */

/**
 * Get cart from localStorage
 * @returns {Array} Cart items
 */
function getCart() {
    const cartData = localStorage.getItem('bookstore_cart');
    return cartData ? JSON.parse(cartData) : [];
}

/**
 * Update cart badge in navigation
 */
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const count = getCartItemCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

/**
 * Initialize cart page
 */
function initCartPage() {
    renderCartItems();
    updateCartSummary();
    
    // Update badge
    updateCartBadge();
}

/**
 * Render cart items
 */
function renderCartItems() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    const emptyCart = document.getElementById('empty-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    container.style.display = 'flex';
    if (emptyCart) emptyCart.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    container.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
    
    // Add event listeners
    setupCartItemListeners();
}

/**
 * Create cart item HTML
 */
function createCartItemHTML(item) {
    const subtotal = item.price * item.quantity;
    
    return `
        <div class="cart-item" data-book-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            
            <div class="cart-item-details">
                <h3 class="cart-item-title">
                    <a href="book-detail.html?id=${item.id}">${item.title}</a>
                </h3>
                <p class="cart-item-author">${item.author}</p>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="qty-btn-cart qty-decrease" data-book-id="${item.id}">-</button>
                    <input type="number" class="qty-input-cart" value="${item.quantity}" 
                           min="1" max="10" data-book-id="${item.id}" readonly>
                    <button class="qty-btn-cart qty-increase" data-book-id="${item.id}">+</button>
                </div>
                <div class="cart-item-subtotal">₹${subtotal}</div>
                <button class="btn-remove" data-book-id="${item.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Remove
                </button>
            </div>
        </div>
    `;
}

/**
 * Setup cart item event listeners
 */
function setupCartItemListeners() {
    // Quantity decrease buttons
    document.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            const input = document.querySelector(`.qty-input-cart[data-book-id="${bookId}"]`);
            const currentQty = parseInt(input.value);
            
            if (currentQty > 1) {
                updateQuantity(bookId, currentQty - 1);
                renderCartItems();
                updateCartSummary();
            }
        });
    });
    
    // Quantity increase buttons
    document.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            const input = document.querySelector(`.qty-input-cart[data-book-id="${bookId}"]`);
            const currentQty = parseInt(input.value);
            const maxQty = parseInt(input.max);
            
            if (currentQty < maxQty) {
                updateQuantity(bookId, currentQty + 1);
                renderCartItems();
                updateCartSummary();
            }
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            if (confirm('Remove this item from cart?')) {
                removeFromCart(bookId);
                renderCartItems();
                updateCartSummary();
            }
        });
    });
}

/**
 * Update cart summary
 */
function updateCartSummary() {
    const cart = getCart();
    const itemCount = getCartItemCount();
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const tax = calculateTax(subtotal);
    const total = subtotal + shipping + tax;
    
    // Update item count
    const itemCountEl = document.getElementById('item-count');
    if (itemCountEl) itemCountEl.textContent = itemCount;
    
    // Update amounts
    const subtotalEl = document.getElementById('subtotal-amount');
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    
    const shippingEl = document.getElementById('shipping-amount');
    if (shippingEl) {
        shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
        shippingEl.style.color = shipping === 0 ? 'var(--success)' : 'inherit';
    }
    
    const taxEl = document.getElementById('tax-amount');
    if (taxEl) taxEl.textContent = `₹${Math.round(tax)}`;
    
    const totalEl = document.getElementById('total-amount');
    if (totalEl) totalEl.textContent = `₹${Math.round(total)}`;
}

/**
 * Show toast notification (if not already defined)
 */
if (typeof showToast === 'undefined') {
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#10b981' : type === 'info' ? '#2563eb' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize cart page if on cart page
if (document.getElementById('cart-page')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initCartPage, 100);
    });
}

// Update cart badge on all pages
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});
