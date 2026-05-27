/* ===================================
   BookStore - Main JavaScript
   Core functionality and navigation
   =================================== */

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('BookStore app initialized');
    
    // Initialize navigation
    initNavigation();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Update cart badge
    updateCartBadge();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * Update cart badge with item count
 */
function updateCartBadge() {
    const cart = getCart();
    const badge = document.querySelector('.cart-badge');
    
    if (badge) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = itemCount;
        badge.style.display = itemCount > 0 ? 'block' : 'none';
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Format price to currency
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    return `₹${price.toFixed(2)}`;
}

/**
 * Get cart from localStorage
 * @returns {Array} Cart items
 */
function getCart() {
    const cart = localStorage.getItem('bookstore_cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Additional functions will be added in subsequent phases

// Made with Bob
