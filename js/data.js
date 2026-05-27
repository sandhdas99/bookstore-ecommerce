/* ===================================
   BookStore - Data Management
   =================================== */

// Sample books data (will be replaced with books.json in Phase 9)
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 299,
        originalPrice: 399,
        category: "Fiction",
        rating: 4.5,
        reviews: 128,
        image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
        isbn: "978-0-7432-7356-5",
        publisher: "Scribner",
        publishDate: "1925-04-10",
        pages: 180,
        inStock: true
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 349,
        originalPrice: 449,
        category: "Fiction",
        rating: 4.8,
        reviews: 256,
        image: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
        description: "A gripping tale of racial injustice and childhood innocence in the American South.",
        isbn: "978-0-06-112008-4",
        publisher: "Harper Perennial",
        publishDate: "1960-07-11",
        pages: 324,
        inStock: true
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        price: 279,
        originalPrice: 379,
        category: "Science Fiction",
        rating: 4.6,
        reviews: 189,
        image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        description: "A dystopian social science fiction novel and cautionary tale about totalitarianism.",
        isbn: "978-0-452-28423-4",
        publisher: "Signet Classic",
        publishDate: "1949-06-08",
        pages: 328,
        inStock: true
    }
];

/**
 * Load books from JSON file
 * @returns {Promise<Array>} Books data
 */
async function loadBooksFromJSON() {
    try {
        const response = await fetch('data/books.json');
        if (response.ok) {
            books = await response.json();
            return books;
        }
    } catch (error) {
        console.log('Using sample data:', error);
    }
    return books;
}

/**
 * Get book by ID
 * @param {number} bookId - Book ID
 * @returns {Object|null} Book object or null
 */
function getBookById(bookId) {
    return books.find(book => book.id === bookId) || null;
}

/**
 * Get featured books
 * @param {number} count - Number of books to return
 * @returns {Array} Featured books
 */
function getFeaturedBooks(count = 6) {
    // Return books with highest ratings
    return [...books]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, count);
}

/**
 * Get related books
 * @param {number} bookId - Current book ID
 * @param {number} count - Number of related books
 * @returns {Array} Related books
 */
function getRelatedBooks(bookId, count = 4) {
    const currentBook = getBookById(bookId);
    if (!currentBook) return [];
    
    // Get books from same category, excluding current book
    return books
        .filter(book => book.id !== bookId && book.category === currentBook.category)
        .slice(0, count);
}

/**
 * Get books by category
 * @param {string} category - Category name
 * @returns {Array} Books in category
 */
function getBooksByCategory(category) {
    return books.filter(book => book.category === category);
}

/**
 * Get all books
 * @returns {Array} All books
 */
function getAllBooks() {
    return books;
}

/**
 * Check if book is in stock
 * @param {number} bookId - Book ID
 * @returns {boolean} Stock status
 */
function isInStock(bookId) {
    const book = getBookById(bookId);
    return book ? book.inStock : false;
}

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBooksFromJSON().then(() => {
        console.log(`Loaded ${books.length} books`);
    });
});

// Additional data management functions will be added in Phase 9

// Made with Bob
