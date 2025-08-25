const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');


router.post('/rent-book', async (req, res) => {
  try {
    const { userId, bookId } = req.body;

 
    if (!userId || !bookId) {
      return res.status(400).json({ 
        error: 'User ID and Book ID are required' 
      });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

  
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

   
    if (user.rentedBooks.includes(bookId)) {
      return res.status(400).json({ 
        error: 'User has already rented this book' 
      });
    }

  
    user.rentedBooks.push(bookId);
    await user.save();
 

    book.rentedBy.push(userId);
    await book.save();

    res.json({ 
      message: 'Book rented successfully',
      user: user.name,
      book: book.title
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/return-book', async (req, res) => {
  try {
    const { userId, bookId } = req.body;


    if (!userId || !bookId) {
      return res.status(400).json({ 
        error: 'User ID and Book ID are required' 
      });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }


    if (!user.rentedBooks.includes(bookId)) {
      return res.status(400).json({ 
        error: 'User has not rented this book' 
      });
    }


    user.rentedBooks = user.rentedBooks.filter(
      rentedBookId => rentedBookId.toString() !== bookId
    );
    await user.save();

    book.rentedBy = book.rentedBy.filter(
      renterId => renterId.toString() !== userId
    );
    await book.save();

    res.json({ 
      message: 'Book returned successfully',
      user: user.name,
      book: book.title
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
