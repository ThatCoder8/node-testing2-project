const router = require('express').Router();
const Books = require('./books-model');

router.get('/', async (req, res, next) => {
  try {
    const books = await Books.find();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const book = await Books.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }
    const newBook = await Books.add(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }
    const book = await Books.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const updatedBook = await Books.update(req.params.id, req.body);
    res.json(updatedBook);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const book = await Books.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await Books.remove(req.params.id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
