"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouter = void 0;
const express_1 = __importDefault(require("express"));
const booksController_1 = require("../controllers/booksController");
const setHeaders_1 = require("../middleware/setHeaders");
const isAuth_1 = require("../middleware/isAuth");
const express_validator_1 = require("express-validator");
exports.bookRouter = express_1.default.Router();
exports.bookRouter.get('/search', setHeaders_1.setHeader, isAuth_1.isAuth, booksController_1.getSearchPage);
exports.bookRouter.get('/books/:q/:langRestrict', booksController_1.getSearchedBook);
exports.bookRouter.get('/favorites/:title/:id', setHeaders_1.setHeader, isAuth_1.isAuth, booksController_1.getToggleFav);
exports.bookRouter.post('/search', (0, express_validator_1.check)('userInput').isLength({ min: 1 }).withMessage('Please enter some'), setHeaders_1.setHeader, isAuth_1.isAuth, booksController_1.postSearchBooks);
