const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');


router.post('/add-book', async (req, res) => {
  try {
    const { title, author, genre } = req.body;

    if (!title || !author) {
      return res.status(400).json({ 
        error: 'Title and author fields are required' 
      });
    }

    if (title.length < 3) {
      return res.status(400).json({ 
        error: 'Title must be at least 3 characters long' 
      });
    }

 
    const newBook = new Book({ title, author, genre });
    const savedBook = await newBook.save();

    res.status(201).json({ 
      message: 'Book added successfully', 
      book: savedBook 
    });

  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
});


router.get('/book-renters/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate('rentedBy');
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      book: book.title,
      rentedBy: book.rentedBy
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/update-book/:bookId', async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.bookId,
      { title, author, genre },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ 
      message: 'Book updated successfully', 
      book: updatedBook 
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/delete-book/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

 
    await User.updateMany(
      { rentedBooks: req.params.bookId },
      { $pull: { rentedBooks: req.params.bookId } }
    );

    
    await Book.findByIdAndDelete(req.params.bookId);

    res.json({ 
      message: 'Book deleted successfully and removed from all users' 
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
