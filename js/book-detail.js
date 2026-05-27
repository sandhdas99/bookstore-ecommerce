/* ===================================
   BOOK DETAIL PAGE FUNCTIONALITY
   =================================== */

// Get book ID from URL parameter
function getBookIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

// Sample reviews data
const sampleReviews = [
    {
        author: "John Smith",
        rating: 5,
        date: "2024-01-15",
        text: "Absolutely loved this book! The writing is captivating and the story keeps you engaged from start to finish."
    },
    {
        author: "Sarah Johnson",
        rating: 4,
        date: "2024-01-10",
        text: "Great read! Well-written and thought-provoking. Highly recommend to anyone interested in this genre."
    },
    {
        author: "Michael Brown",
        rating: 5,
        date: "2024-01-05",
        text: "One of the best books I've read this year. The characters are well-developed and the plot is engaging."
    }
];

/**
 * Initialize book detail page
 */
function initBookDetail() {
    const bookId = getBookIdFromURL();
    const book = getBookById(bookId);
    
    if (!book) {
        showBookNotFound();
        return;
    }
    
    renderBookDetail(book);
    setupQuantityControls();
    setupTabSwitching();
    setupAddToCart(book);
    renderRelatedBooks(bookId);
}

/**
 * Render book details
 */
function renderBookDetail(book) {
    // Update page title
    document.title = `${book.title} - BookStore`;
    
    // Breadcrumb
    document.getElementById('breadcrumb-title').textContent = book.title;
    
    // Book image
    const bookImage = document.getElementById('book-detail-image');
    bookImage.src = book.image;
    bookImage.alt = book.title;
    
    // Badges
    const badgesContainer = document.getElementById('book-badges');
    const discount = book.originalPrice ? 
        Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;
    
    if (discount > 0) {
        badgesContainer.innerHTML = `<div class="book-badge badge-sale">${discount}% OFF</div>`;
    }
    
    // Book title and author
    document.getElementById('book-title').textContent = book.title;
    document.querySelector('#book-author span').textContent = book.author;
    
    // Rating
    const stars = '★'.repeat(Math.floor(book.rating)) + 
                  '☆'.repeat(5 - Math.floor(book.rating));
    document.getElementById('book-stars').textContent = stars;
    document.getElementById('book-rating-text').textContent = book.rating.toFixed(1);
    document.getElementById('book-reviews-count').textContent = `(${book.reviews} reviews)`;
    
    // Price
    document.getElementById('book-price-current').textContent = `₹${book.price}`;
    if (book.originalPrice) {
        document.getElementById('book-price-original').textContent = `₹${book.originalPrice}`;
        document.getElementById('book-discount').textContent = `${discount}% OFF`;
    }
    
    // Meta information
    document.getElementById('book-category').textContent = book.category;
    document.getElementById('book-publisher').textContent = book.publisher;
    document.getElementById('book-isbn').textContent = book.isbn;
    document.getElementById('book-pages').textContent = `${book.pages} pages`;
    
    const publishDate = new Date(book.publishDate);
    document.getElementById('book-publish-date').textContent = 
        publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Stock status
    const stockElement = document.getElementById('book-stock');
    if (!book.inStock) {
        stockElement.classList.add('out-of-stock');
        stockElement.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>Out of Stock</span>
        `;
    }
    
    // Description
    document.getElementById('book-description').textContent = book.description;
    
    // Reviews
    renderReviews(book);
    
    // Author info
    document.getElementById('author-name').textContent = book.author;
    document.getElementById('author-bio').textContent = 
        `${book.author} is a renowned author known for their compelling storytelling and unique narrative style. Their works have captivated readers worldwide.`;
}

/**
 * Setup quantity controls
 */
function setupQuantityControls() {
    const qtyInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('qty-decrease');
    const increaseBtn = document.getElementById('qty-increase');
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        const maxValue = parseInt(qtyInput.max);
        if (currentValue < maxValue) {
            qtyInput.value = currentValue + 1;
        }
    });
    
    qtyInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        const min = parseInt(e.target.min);
        const max = parseInt(e.target.max);
        
        if (isNaN(value) || value < min) {
            e.target.value = min;
        } else if (value > max) {
            e.target.value = max;
        }
    });
}

/**
 * Setup tab switching
 */
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

/**
 * Setup add to cart functionality
 */
function setupAddToCart(book) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (!book.inStock) {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Out of Stock';
        return;
    }
    
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        addToCart(book.id, quantity);
        
        // Show success message
        showToast('Added to cart successfully!', 'success');
    });
}

/**
 * Render reviews
 */
function renderReviews(book) {
    // Average rating
    document.getElementById('average-rating').textContent = book.rating.toFixed(1);
    document.getElementById('reviews-stars').textContent = 
        '★'.repeat(Math.floor(book.rating)) + '☆'.repeat(5 - Math.floor(book.rating));
    document.getElementById('total-reviews').textContent = `${book.reviews} reviews`;
    
    // Rating breakdown
    const breakdown = document.getElementById('reviews-breakdown');
    const ratings = [5, 4, 3, 2, 1];
    const distribution = {
        5: 60,
        4: 25,
        3: 10,
        2: 3,
        1: 2
    };
    
    breakdown.innerHTML = ratings.map(rating => {
        const percentage = distribution[rating];
        return `
            <div class="rating-bar">
                <span class="rating-bar-label">${rating} stars</span>
                <div class="rating-bar-track">
                    <div class="rating-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="rating-bar-count">${percentage}%</span>
            </div>
        `;
    }).join('');
    
    // Reviews list
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = sampleReviews.map(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const date = new Date(review.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-date">${date}</span>
                </div>
                <div class="review-rating">${stars}</div>
                <p class="review-text">${review.text}</p>
            </div>
        `;
    }).join('');
}

/**
 * Render related books
 */
function renderRelatedBooks(bookId) {
    const relatedBooks = getRelatedBooks(bookId, 4);
    const grid = document.getElementById('related-books-grid');
    
    if (relatedBooks.length === 0) {
        grid.innerHTML = '<p>No related books found.</p>';
        return;
    }
    
    grid.innerHTML = relatedBooks.map(book => {
        const discount = book.originalPrice ? 
            Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;
        const stars = '★'.repeat(Math.floor(book.rating)) + 
                      '☆'.repeat(5 - Math.floor(book.rating));
        
        return `
            <div class="book-card hover-lift">
                <div class="book-image-wrapper">
                    <a href="book-detail.html?id=${book.id}">
                        <img src="${book.image}" alt="${book.title}" class="book-image" loading="lazy">
                    </a>
                    ${discount > 0 ? `<div class="book-badge badge-sale">${discount}% OFF</div>` : ''}
                </div>
                <div class="book-info">
                    <h3 class="book-title">
                        <a href="book-detail.html?id=${book.id}">${book.title}</a>
                    </h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-count">(${book.rating})</span>
                    </div>
                    <div class="book-price-row">
                        <div class="book-price">
                            <span class="price-current">₹${book.price}</span>
                            ${book.originalPrice ? `<span class="price-original">₹${book.originalPrice}</span>` : ''}
                        </div>
                        <button class="btn btn-primary btn-sm add-to-cart" 
                                data-book-id="${book.id}"
                                onclick="addToCart(${book.id}, 1); showToast('Added to cart!', 'success');">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Show book not found message
 */
function showBookNotFound() {
    document.querySelector('.book-detail-page .container').innerHTML = `
        <div style="text-align: center; padding: 4rem 0;">
            <h1>Book Not Found</h1>
            <p>The book you're looking for doesn't exist.</p>
            <a href="catalog.html" class="btn btn-primary">Browse Catalog</a>
        </div>
    `;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on page load
if (document.getElementById('book-detail-page')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initBookDetail, 100);
    });
}

// Made with Bob
