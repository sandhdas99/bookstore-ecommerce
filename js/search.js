/* ===================================
   BookStore - Search and Filter Logic
   =================================== */

/**
 * Search books by query
 * @param {string} query - Search query
 * @returns {Array} Filtered books
 */
function searchBooks(query) {
    if (!query || query.trim() === '') {
        return books;
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return books.filter(book => {
        return book.title.toLowerCase().includes(searchTerm) ||
               book.author.toLowerCase().includes(searchTerm) ||
               book.description.toLowerCase().includes(searchTerm) ||
               book.category.toLowerCase().includes(searchTerm);
    });
}

/**
 * Filter books by category
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered books
 */
function filterByCategory(category) {
    if (!category || category === 'all') {
        return books;
    }
    return books.filter(book => book.category === category);
}

/**
 * Filter books by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} Filtered books
 */
function filterByPrice(minPrice, maxPrice) {
    return books.filter(book => {
        return book.price >= minPrice && book.price <= maxPrice;
    });
}

/**
 * Filter books by rating
 * @param {number} minRating - Minimum rating
 * @returns {Array} Filtered books
 */
function filterByRating(minRating) {
    return books.filter(book => book.rating >= minRating);
}

/**
 * Apply all filters
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered books
 */
function applyAllFilters(filters) {
    let filteredBooks = [...books];
    
    // Apply search query
    if (filters.query) {
        filteredBooks = searchBooks(filters.query);
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.category === filters.category);
    }
    
    // Apply price range filter
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        filteredBooks = filteredBooks.filter(book => {
            return book.price >= filters.minPrice && book.price <= filters.maxPrice;
        });
    }
    
    // Apply rating filter
    if (filters.minRating) {
        filteredBooks = filteredBooks.filter(book => book.rating >= filters.minRating);
    }
    
    return filteredBooks;
}

/**
 * Sort books by criteria
 * @param {Array} books - Books to sort
 * @param {string} criteria - Sort criteria (price-asc, price-desc, rating, newest)
 * @returns {Array} Sorted books
 */
function sortBooks(books, criteria) {
    const sortedBooks = [...books];
    
    switch (criteria) {
        case 'price-asc':
            return sortedBooks.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sortedBooks.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedBooks.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sortedBooks.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        case 'title':
            return sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return sortedBooks;
    }
}

/**
 * Get unique categories from books
 * @returns {Array} List of unique categories
 */
function getCategories() {
    const categories = books.map(book => book.category);
    return [...new Set(categories)].sort();
}

/**
 * Highlight search results in text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} Text with highlighted matches
 */
function highlightSearchResults(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Get price range from books
 * @returns {Object} Min and max prices
 */
function getPriceRange() {
    const prices = books.map(book => book.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
}

// Additional search and filter functions will be added in Phase 4

// Made with Bob

/* ===================================
   CATALOG PAGE FUNCTIONALITY
   =================================== */

// Catalog state
let catalogState = {
    allBooks: [],
    filteredBooks: [],
    currentFilters: {
        categories: [],
        minPrice: 0,
        maxPrice: 1000,
        minRating: 0,
        inStock: true,
        query: ''
    },
    currentSort: 'featured',
    currentPage: 1,
    booksPerPage: 12
};

/**
 * Initialize catalog page
 */
function initCatalog() {
    catalogState.allBooks = getAllBooks();
    catalogState.filteredBooks = [...catalogState.allBooks];
    
    setupFilterListeners();
    setupSortListener();
    setupSearchListener();
    
    renderCatalogBooks();
    updateBookCount();
}

/**
 * Setup filter event listeners
 */
function setupFilterListeners() {
    // Category filters
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCategoryFilter);
    });
    
    // Price range
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceSlider = document.getElementById('price-slider');
    
    if (minPriceInput && maxPriceInput) {
        minPriceInput.addEventListener('input', handlePriceFilter);
        maxPriceInput.addEventListener('input', handlePriceFilter);
    }
    
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            if (maxPriceInput) {
                maxPriceInput.value = e.target.value;
                handlePriceFilter();
            }
        });
    }
    
    // Rating filter
    const ratingRadios = document.querySelectorAll('input[name="rating"]');
    ratingRadios.forEach(radio => {
        radio.addEventListener('change', handleRatingFilter);
    });
    
    // Clear filters button
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
}

/**
 * Setup sort event listener
 */
function setupSortListener() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            catalogState.currentSort = e.target.value;
            applySorting();
            renderCatalogBooks();
        });
    }
}

/**
 * Setup search event listener
 */
function setupSearchListener() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchInput) {
                handleSearch({ target: searchInput });
            }
        });
    }
}

/**
 * Handle category filter change
 */
function handleCategoryFilter(e) {
    const value = e.target.value;
    const isChecked = e.target.checked;
    
    if (value === 'all') {
        // If "All Categories" is checked, uncheck others
        if (isChecked) {
            catalogState.currentFilters.categories = [];
            document.querySelectorAll('input[name="category"]').forEach(cb => {
                if (cb.value !== 'all') cb.checked = false;
            });
        }
    } else {
        // Uncheck "All Categories"
        const allCheckbox = document.querySelector('input[name="category"][value="all"]');
        if (allCheckbox) allCheckbox.checked = false;
        
        if (isChecked) {
            catalogState.currentFilters.categories.push(value);
        } else {
            catalogState.currentFilters.categories = 
                catalogState.currentFilters.categories.filter(cat => cat !== value);
        }
    }
    
    applyFilters();
}

/**
 * Handle price filter change
 */
function handlePriceFilter() {
    const minPrice = parseInt(document.getElementById('min-price')?.value || 0);
    const maxPrice = parseInt(document.getElementById('max-price')?.value || 1000);
    
    catalogState.currentFilters.minPrice = minPrice;
    catalogState.currentFilters.maxPrice = maxPrice;
    
    applyFilters();
}

/**
 * Handle rating filter change
 */
function handleRatingFilter(e) {
    catalogState.currentFilters.minRating = parseFloat(e.target.value);
    applyFilters();
}

/**
 * Handle search input
 */
function handleSearch(e) {
    catalogState.currentFilters.query = e.target.value;
    applyFilters();
}

/**
 * Apply all filters
 */
function applyFilters() {
    let filtered = [...catalogState.allBooks];
    
    // Apply search query
    if (catalogState.currentFilters.query) {
        const query = catalogState.currentFilters.query.toLowerCase();
        filtered = filtered.filter(book => 
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.description.toLowerCase().includes(query)
        );
    }
    
    // Apply category filter
    if (catalogState.currentFilters.categories.length > 0) {
        filtered = filtered.filter(book => 
            catalogState.currentFilters.categories.includes(book.category.toLowerCase())
        );
    }
    
    // Apply price filter
    filtered = filtered.filter(book => 
        book.price >= catalogState.currentFilters.minPrice &&
        book.price <= catalogState.currentFilters.maxPrice
    );
    
    // Apply rating filter
    if (catalogState.currentFilters.minRating > 0) {
        filtered = filtered.filter(book => 
            book.rating >= catalogState.currentFilters.minRating
        );
    }
    
    // Apply stock filter
    if (catalogState.currentFilters.inStock) {
        filtered = filtered.filter(book => book.inStock);
    }
    
    catalogState.filteredBooks = filtered;
    applySorting();
    renderCatalogBooks();
    updateBookCount();
}

/**
 * Apply sorting
 */
function applySorting() {
    const criteria = catalogState.currentSort;
    
    switch (criteria) {
        case 'price-low':
            catalogState.filteredBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            catalogState.filteredBooks.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            catalogState.filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            catalogState.filteredBooks.sort((a, b) => 
                new Date(b.publishDate) - new Date(a.publishDate)
            );
            break;
        case 'title':
            catalogState.filteredBooks.sort((a, b) => 
                a.title.localeCompare(b.title)
            );
            break;
        default:
            // Featured - keep original order or sort by rating
            catalogState.filteredBooks.sort((a, b) => b.rating - a.rating);
    }
}

/**
 * Render catalog books
 */
function renderCatalogBooks() {
    const grid = document.getElementById('catalog-books-grid');
    if (!grid) return;
    
    if (catalogState.filteredBooks.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3>No books found</h3>
                <p>Try adjusting your filters or search query</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = catalogState.filteredBooks.map(book => createBookCard(book)).join('');
    
    // Add event listeners to "Add to Cart" buttons
    grid.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            addToCart(bookId, 1);
        });
    });
}

/**
 * Create book card HTML
 */
function createBookCard(book) {
    const discount = book.originalPrice ? 
        Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;
    
    const stars = '★'.repeat(Math.floor(book.rating)) + 
                  (book.rating % 1 >= 0.5 ? '★' : '☆').repeat(5 - Math.ceil(book.rating));
    
    return `
        <div class="book-card hover-lift">
            <div class="book-image-wrapper">
                <img src="${book.image}" alt="${book.title}" class="book-image" loading="lazy">
                ${discount > 0 ? `<div class="book-badge badge-sale">${discount}% OFF</div>` : ''}
                ${!book.inStock ? '<div class="book-badge" style="background: #6b7280;">Out of Stock</div>' : ''}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
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
                            ${!book.inStock ? 'disabled' : ''}>
                        ${book.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Update book count display
 */
function updateBookCount() {
    const countElement = document.getElementById('book-count');
    if (countElement) {
        countElement.textContent = catalogState.filteredBooks.length;
    }
}

/**
 * Clear all filters
 */
function clearAllFilters() {
    // Reset filter state
    catalogState.currentFilters = {
        categories: [],
        minPrice: 0,
        maxPrice: 1000,
        minRating: 0,
        inStock: true,
        query: ''
    };
    
    // Reset UI
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.checked = cb.value === 'all';
    });
    
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.checked = radio.value === '0';
    });
    
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceSlider = document.getElementById('price-slider');
    
    if (minPriceInput) minPriceInput.value = 0;
    if (maxPriceInput) maxPriceInput.value = 1000;
    if (priceSlider) priceSlider.value = 1000;
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    applyFilters();
}

/**
 * Debounce function for search
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize catalog if on catalog page
if (document.getElementById('catalog-books-grid')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for books to load
        setTimeout(initCatalog, 100);
    });
}
