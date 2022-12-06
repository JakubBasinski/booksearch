"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToggleFav = exports.postSearchBooks = exports.getSearchedBook = exports.getSearchPage = void 0;
const axios_1 = __importDefault(require("axios"));
const user_1 = require("../models/user");
const express_validator_1 = require("express-validator");
const getSearchPage = async (req, res, next) => {
    try {
        res.status(200).render('search.ejs', {
            validationError: [],
        });
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.getSearchPage = getSearchPage;
const getSearchedBook = async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const q = req.params.q;
    const langRestrict = req.params.langRestrict;
    const email = req.session.user.email;
    const user = await user_1.User.findOne({ email: email });
    let favorites = [];
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).render('search.ejs', {
            validationError: [],
        });
    }
    favorites = [...user.favorites];
    try {
        const { data } = await axios_1.default.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: q,
                key: process.env.GOOGLE_API_KEY,
                langRestrict: langRestrict,
                maxResults: 40,
            },
        });
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
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.getSearchedBook = getSearchedBook;
const postSearchBooks = async (req, res, next) => {
    const bookSearach = req.body.userInput;
    const authorTitleSelect = req.body.inlineRadioOptions;
    const language = req.body.languageSelect;
    try {
        let searchParam = '';
        if (authorTitleSelect === 'intitle') {
            searchParam = bookSearach;
        }
        else {
            searchParam = `inauthor:${bookSearach}`;
        }
        res.redirect(`/books/${searchParam}/${language}?page=1`);
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.postSearchBooks = postSearchBooks;
const getToggleFav = async (req, res, next) => {
    const userSession = req.session.user;
    const title = req.params.title;
    const bookId = req.params.id;
    const book = {
        title: title,
        id: bookId,
    };
    const user = await user_1.User.findOne({ email: userSession.email });
    let favorites = user.favorites;
    let isBookInFav = favorites.filter((obj) => {
        return obj.id == req.params.id;
    });
    try {
        if (isBookInFav.length > 0) {
            await user_1.User.findOneAndUpdate({ email: userSession.email }, {
                $pull: {
                    favorites: { id: bookId },
                },
            });
        }
        else {
            favorites.push(book);
            user.save();
        }
        req.session.save((err) => {
            res.status(200).redirect('back');
        });
    }
    catch (err) {
        const error = new Error(err);
        next(error);
    }
};
exports.getToggleFav = getToggleFav;
