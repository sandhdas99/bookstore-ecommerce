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

/* ===================================
   PHASE 11: ENHANCED JAVASCRIPT FUNCTIONALITY
   =================================== */

/**
 * Modal Component System
 */
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.overlay = this.modal?.querySelector('.modal-overlay');
        
        if (this.modal) {
            this.init();
        }
    }
    
    init() {
        // Close on X button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Close on overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Enhanced Search Functionality
 */
function initGlobalSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        // Real-time search with debounce
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300);
        });
        
        // Search on button click
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                performSearch(searchInput.value);
            });
        }
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

/**
 * Perform search and redirect to catalog
 */
function performSearch(query) {
    if (query.trim()) {
        // Redirect to catalog with search query
        window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
    }
}

/**
 * Keyboard Navigation Enhancement
 */
function initKeyboardNavigation() {
    // Tab navigation for cards
    const cards = document.querySelectorAll('.book-card');
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) link.click();
            }
        });
    });
    
    // Arrow key navigation for forms
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && index < formInputs.length - 1) {
                e.preventDefault();
                formInputs[index + 1].focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                e.preventDefault();
                formInputs[index - 1].focus();
            }
        });
    });
}

/**
 * Image Lazy Loading
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Form Validation Enhancement
 */
function enhanceFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });
    });
}

/**
 * Validate individual input
 */
function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Required check
    if (required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email';
        }
    }
    // Phone validation
    else if (input.name === 'phone' && value) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid 10-digit phone number';
        }
    }
    
    // Update UI
    const errorElement = input.parentElement.querySelector('.error-message');
    if (isValid) {
        input.classList.remove('error');
        if (errorElement) errorElement.textContent = '';
    } else {
        input.classList.add('error');
        if (errorElement) errorElement.textContent = errorMessage;
    }
    
    return isValid;
}

/**
 * Scroll to Top Button
 */
function initScrollToTop() {
    // Create button if it doesn't exist
    let scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(scrollBtn);
    }
    
    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Local Storage Manager
 */
const StorageManager = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
};

/**
 * Performance Monitoring
 */
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        });
    }
}

/**
 * Initialize all enhanced features
 */
function initEnhancedFeatures() {
    initGlobalSearch();
    initKeyboardNavigation();
    initLazyLoading();
    enhanceFormValidation();
    initScrollToTop();
    initPerformanceMonitoring();
}

// Initialize enhanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', initEnhancedFeatures);


/* ===================================
   SMOOTH SCROLLING FOR NAVIGATION
   =================================== */

/**
 * Initialize smooth scrolling for hash links
 */
function initSmoothScrolling() {
    // Handle all navigation links with hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
                
                // Smooth scroll to target
                const headerOffset = 80; // Account for fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
    
    // Handle direct hash navigation on page load
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

/* ===================================
   CONTACT FORM HANDLING
   =================================== */

/**
 * Initialize contact form
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

/**
 * Handle contact form submission
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all fields
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    // Get form values
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success
        showToast('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Store in localStorage for demo purposes
        const messages = StorageManager.get('contact_messages') || [];
        messages.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        StorageManager.set('contact_messages', messages);
        
        console.log('Contact form submitted:', data);
    }, 1500);
}

/* ===================================
   ACTIVE NAVIGATION HIGHLIGHTING
   =================================== */

/**
 * Highlight active section in navigation
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttle scroll event
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(highlightNavigation);
    });
    
    // Initial check
    highlightNavigation();
}

/* ===================================
   INITIALIZE NEW FEATURES
   =================================== */

// Add to existing DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initContactForm();
    initActiveNavigation();
});
