import express from 'express';
import {
  getSearchPage,
  getSearchedBook,
  postSearchBooks,
  getToggleFav,
} from '../controllers/booksController';
import { setHeader } from '../middleware/setHeaders';
import { isAuth } from '../middleware/isAuth';
import { check } from 'express-validator';

export const bookRouter = express.Router();

bookRouter.get('/search',setHeader, isAuth, getSearchPage);
bookRouter.get('/books/:q/:langRestrict', getSearchedBook);
bookRouter.get('/favorites/:title/:id',setHeader, isAuth, getToggleFav);

bookRouter.post(
  '/search',
  check('userInput').isLength({ min: 1 }).withMessage('Please enter some'),
  setHeader,
  isAuth,
  postSearchBooks
);
