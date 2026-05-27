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
