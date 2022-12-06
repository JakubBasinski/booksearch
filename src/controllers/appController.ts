import { RequestHandler } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const getHomePage: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).render('home.ejs');
  } catch (err: any) {
    const error = new Error(err);
    return next(error);
  }
};

export const getSignupPage: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).render('signup.ejs', {
      errorMessage: req.flash('error'),
      validationError: [],
    });
  } catch (err: any) {
    const error = new Error(err);
    return next(error);
  }
};

export const getLoginPage: RequestHandler = (req, res, next) => {
  try {
    res.status(200).render('login.ejs', {
      errorMessage: req.flash('error'),
      validationError: [],
    });
  } catch (err: any) {
    const error = new Error(err);
    return next(error);
  }
};

export const getLogout: RequestHandler = (req, res, next) => {
  try {
    req.session.destroy((err) => {
      res.status(302).redirect('/');
    });
  } catch (err: any) {
    const error = new Error(err);
    return next(error);
  }
};

export const postSignupPage: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(200).render('signup.ejs', {
      errorMessage: req.flash('error'),
      validationError: errors.array(),
    });
  }
  try {
    const isUser = await User.findOne({ email: email });
    if (isUser) {
      req.flash('error', 'User with this email already exists');
      req.session.save((err) => {
        res.redirect('/signup');
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        favorites: [],
      });
      user.save();
      res.redirect('/login');
    }
  } catch (err: any) {
    const error = new Error(err);
    return next(error);
  }
};

export const getBookInfo: RequestHandler = async (req, res, next) => {
  res.download("dist/public/images/bookinfo.pdf");
}

export const postLogin: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('login.ejs', {
      errorMessage: req.flash('error'),
      validationError: errors.array(),
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash('error', 'Email does not exist in database');
      return req.session.save((err) => {
        res.status(302).render('search.ejs');
      });
    }
    const doMatch = await bcrypt.compare(password, user!.password);
    if (doMatch) {
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.TOKEN_SECRET as string,
        { expiresIn: '1h' }
      );
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.token = token;
      req.session.save((err) => {
        res.status(302).redirect('search');
      });
    } else {
      req.flash('error', 'Incorrect password');
      return req.session.save((err) => {
        res.status(302).redirect('/login');
      });
    }
  } catch (err: any) {
    const error = new Error(err);
    return next(error);
  }
};
