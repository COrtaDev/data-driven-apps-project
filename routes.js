const express = require('express');
const csrf = require('csurf');
const db = require('./db/models');

const router = express.Router();

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);


router.get('/', asyncHandler(async (req, res, next) => {
  try {
    const books = await db.Book.findAll({ order: [['title', 'ASC']] });
    res.render('book-list', { title: 'Books', books });
  } catch (err) {
    next(err);
  }
}));

router.get('/book/add', csrfProtection, (req, res) => {
  const book = db.Book.build();
  res.render('book-add', {
    title: 'Add Book',
    book,
    csrfToken: req.csrfToken(),
  });
});

router.post('/book/add', csrfProtection, asyncHandler(async (req, res) => {
  const {
    title,
    author,
    releaseDate,
    pageCount,
    publisher,
  } = req.body;

  const book = db.Book.build({
    title,
    author,
    releaseDate,
    pageCount,
    publisher,
  });

  try {
    await book.save();
    res.redirect('/');
  } catch (err) {
    res.render('book-add', {
      title: 'Add Book',
      book,
      error: err,
      csrfToken: req.csrfToken(),
    });
  }
}));

// router.get('/', (req, res) => {
//   throw new Error('This is a test error!');
//   res.render('index', { title: 'Home' });
// });

module.exports = router;
