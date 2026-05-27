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
