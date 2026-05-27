/* ===================================
   CHECKOUT PAGE FUNCTIONALITY
   =================================== */

let currentStep = 1;
const totalSteps = 3;

/**
 * Initialize checkout page
 */
function initCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    renderOrderSummary();
    setupFormValidation();
    setupPaymentMethodToggle();
}

/**
 * Render order summary
 */
function renderOrderSummary() {
    const cart = getCart();
    const orderItems = document.getElementById('order-items');
    
    if (!orderItems) return;
    
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.title}" class="order-item-image">
            <div class="order-item-details">
                <div class="order-item-title">${item.title}</div>
                <div class="order-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="order-item-price">₹${item.price * item.quantity}</div>
        </div>
    `).join('');
    
    // Update totals
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const tax = calculateTax(subtotal);
    const total = subtotal + shipping + tax;
    
    document.getElementById('order-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('order-shipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    document.getElementById('order-tax').textContent = `₹${Math.round(tax)}`;
    document.getElementById('order-total').textContent = `₹${Math.round(total)}`;
}

/**
 * Move to next step
 */
function nextStep() {
    if (!validateCurrentStep()) {
        return;
    }
    
    if (currentStep < totalSteps) {
        // Hide current step
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('completed');
        
        // Show next step
        currentStep++;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Move to previous step
 */
function prevStep() {
    if (currentStep > 1) {
        // Hide current step
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Show previous step
        currentStep--;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('completed');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Validate current step
 */
function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.parentElement.querySelector('.error-message');
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
    }
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
        }
    }
    // Phone validation
    else if (field.id === 'phone' && value) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) {
            errorMessage = 'Please enter a valid 10-digit phone number';
        }
    }
    // ZIP code validation
    else if (field.id === 'zip' && value) {
        const zipRegex = /^\d{6}$/;
        if (!zipRegex.test(value)) {
            errorMessage = 'Please enter a valid 6-digit ZIP code';
        }
    }
    // Card number validation
    else if (field.id === 'card-number' && value) {
        const cardRegex = /^\d{16}$/;
        if (!cardRegex.test(value.replace(/\s/g, ''))) {
            errorMessage = 'Please enter a valid 16-digit card number';
        }
    }
    // Expiry validation
    else if (field.id === 'expiry' && value) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(value)) {
            errorMessage = 'Please enter expiry in MM/YY format';
        }
    }
    // CVV validation
    else if (field.id === 'cvv' && value) {
        const cvvRegex = /^\d{3}$/;
        if (!cvvRegex.test(value)) {
            errorMessage = 'Please enter a valid 3-digit CVV';
        }
    }
    
    // Display error
    if (errorMessage) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        return false;
    } else {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        return true;
    }
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    const form = document.getElementById('checkout-form-element');
    
    if (!form) return;
    
    // Add blur event listeners to all inputs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateCurrentStep()) {
            handleOrderSubmission();
        }
    });
}

/**
 * Setup payment method toggle
 */
function setupPaymentMethodToggle() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('card-details');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
}

/**
 * Handle order submission
 */
function handleOrderSubmission() {
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Clear cart
        clearCart();
        
        // Show success message
        alert('Order placed successfully! Thank you for your purchase.');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }, 2000);
}

// Initialize checkout page
if (document.getElementById('checkout-page')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initCheckout, 100);
    });
}

// Made with Bob
