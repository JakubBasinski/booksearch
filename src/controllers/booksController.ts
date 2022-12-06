import axios from 'axios';
import { RequestHandler } from 'express';
import { Book } from '../models/book';
import { User } from '../models/user';
import { validationResult } from 'express-validator';

export const getSearchPage: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).render('search.ejs', {
      validationError: [],
    });
  } catch (err: any) {
    const error = new Error(err);
    return next(error);
  }
};

export const getSearchedBook: RequestHandler = async (req, res, next) => {
  const page: number = parseInt(req.query.page as string);
  const limit = 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const q = req.params.q;
  const langRestrict = req.params.langRestrict;
  const email = req.session.user.email;

  const user = await User.findOne({ email: email });
  let favorites: Object[] = [];

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).render('search.ejs', {
      validationError: [],
    });
  }

  favorites = [...user!.favorites];

  try {
    const { data } = await axios.get(
      'https://www.googleapis.com/books/v1/volumes',
      {
        params: {
          q: q,
          key: process.env.GOOGLE_API_KEY,
          langRestrict: langRestrict,
          maxResults: 40,
        },
      }
    );

    let results = [];
    let totalPages = 0;

    if (data.items) {
      totalPages = data.items.length / limit;
      results = data.items.slice(startIndex, endIndex);
    }

    res.render('books', {
      books: results,
      totalPages: totalPages,
      currentPage: page,
      lang: langRestrict,
      favorites: favorites,
      validationError: [],
    });
  } catch (err: any) {
    const error = new Error(err);
    return next(error);
  }
};

export const postSearchBooks: RequestHandler = async (req, res, next) => {
  const bookSearach = req.body.userInput;
  const authorTitleSelect = req.body.inlineRadioOptions;
  const language = req.body.languageSelect;
  try {
    let searchParam = '';
    if (authorTitleSelect === 'intitle') {
      searchParam = bookSearach;
    } else {
      searchParam = `inauthor:${bookSearach}`;
    }
    res.redirect(`/books/${searchParam}/${language}?page=1`);
  } catch (err: any) {
    const error = new Error(err);
    return next(error);
  }
};

export const getToggleFav: RequestHandler = async (req, res, next) => {
  const userSession = req.session.user;
  const title = req.params.title;
  const bookId = req.params.id;

  const book: Book = {
    title: title,
    id: bookId,
  };

  const user = await User.findOne({ email: userSession.email });

  let favorites = user!.favorites;
  let isBookInFav = favorites.filter((obj: any) => {
    return obj.id == req.params.id;
  });

  try {
    if (isBookInFav.length > 0) {
      await User.findOneAndUpdate(
        { email: userSession.email },
        {
          $pull: {
            favorites: { id: bookId },
          },
        }
      );
    } else {
      favorites.push(book);
      user!.save();
    }
    req.session.save((err) => {
      res.status(200).redirect('back');
    });
  } catch (err: any) {
    const error = new Error(err);
    next(error);
  }
};
