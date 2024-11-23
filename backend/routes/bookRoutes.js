const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authenticate = require('../middleware/authMiddleware'); // Middleware to check JWT token

// Add a new book
router.post('/', authenticate, async (req, res) => {
    const { title, author, genre, condition, availability, location } = req.body;
    console.log(req);
    const book = new Book({ title, author, genre, condition, availability,location, userId: req.user.id, username: req.user.username });
    
    try {
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Get books for the logged-in user
router.get('/', authenticate, async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');  // Not really needed since `res.json()` does this automatically

        const books = await Book.find({ userId: req.user._id })
        .populate('userId', 'username');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Edit a book
router.put('/:id', authenticate, async (req, res) => {
    const { title, author, genre, condition, availability, location } = req.body;

    try {
        const book = await Book.findByIdAndUpdate(req.params.id, { title, author, genre, condition, availability,location }, { new: true });
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a book
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (deletedBook) {
            res.status(200).json({ message: "Book successfully deleted." });
        } else {
            res.status(404).json({ message: "Book not found." });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Search and filter books
router.get('/search-books', authenticate, async (req, res) => {
    try {
        // Build search criteria from query parameters
        const searchCriteria = { userId: { $ne: req.user.id } }; // Exclude current user's books

        if (req.query.keyword) {
            const keywordRegex = new RegExp(req.query.keyword, 'i');
            searchCriteria.$or = [
                { title: keywordRegex },
                { author: keywordRegex },
                { genre: keywordRegex }
            ];
        }

        if (req.query.availability) searchCriteria.availability = req.query.availability;
        if (req.query.condition) searchCriteria.condition = req.query.condition;
        if (req.query.location) searchCriteria.location = new RegExp(req.query.location, 'i');

        const books = await Book.find(searchCriteria).populate('userId', 'username');;
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Error searching for books' });
    }
});

    
module.exports = router;
