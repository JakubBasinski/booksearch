"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = exports.getBookInfo = exports.postSignupPage = exports.getLogout = exports.getLoginPage = exports.getSignupPage = exports.getHomePage = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getHomePage = async (req, res, next) => {
    try {
        res.status(200).render('home.ejs');
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.getHomePage = getHomePage;
const getSignupPage = async (req, res, next) => {
    try {
        res.status(200).render('signup.ejs', {
            errorMessage: req.flash('error'),
            validationError: [],
        });
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.getSignupPage = getSignupPage;
const getLoginPage = (req, res, next) => {
    try {
        res.status(200).render('login.ejs', {
            errorMessage: req.flash('error'),
            validationError: [],
        });
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.getLoginPage = getLoginPage;
const getLogout = (req, res, next) => {
    try {
        req.session.destroy((err) => {
            res.status(302).redirect('/');
        });
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.getLogout = getLogout;
const postSignupPage = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(200).render('signup.ejs', {
            errorMessage: req.flash('error'),
            validationError: errors.array(),
        });
    }
    try {
        const isUser = await user_1.User.findOne({ email: email });
        if (isUser) {
            req.flash('error', 'User with this email already exists');
            req.session.save((err) => {
                res.redirect('/signup');
            });
        }
        else {
            const hashedPassword = await bcrypt_1.default.hash(password, 12);
            const user = new user_1.User({
                name: name,
                email: email,
                password: hashedPassword,
                favorites: [],
            });
            user.save();
            res.redirect('/login');
        }
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.postSignupPage = postSignupPage;
const getBookInfo = async (req, res, next) => {
    res.download("dist/public/images/bookinfo.pdf");
};
exports.getBookInfo = getBookInfo;
const postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('login.ejs', {
            errorMessage: req.flash('error'),
            validationError: errors.array(),
        });
    }
    try {
        const user = await user_1.User.findOne({ email: email });
        if (!user) {
            req.flash('error', 'Email does not exist in database');
            return req.session.save((err) => {
                res.status(302).render('search.ejs');
            });
        }
        const doMatch = await bcrypt_1.default.compare(password, user.password);
        if (doMatch) {
            const token = jsonwebtoken_1.default.sign({ email: user.email, userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.token = token;
            req.session.save((err) => {
                res.status(302).redirect('search');
            });
        }
        else {
            req.flash('error', 'Incorrect password');
            return req.session.save((err) => {
                res.status(302).redirect('/login');
            });
        }
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.postLogin = postLogin;
