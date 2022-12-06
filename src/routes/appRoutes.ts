import express from 'express';
import { setHeader } from '../middleware/setHeaders';
import { check } from 'express-validator';

import {
  getHomePage,
  getSignupPage,
  getLoginPage,
  getLogout,
  postSignupPage,
  postLogin,
  getBookInfo
} from '../controllers/appController';

export const appRouter = express.Router();

appRouter.get('', getHomePage);
appRouter.get('/signup', getSignupPage);
appRouter.get('/login', getLoginPage);
appRouter.get('/logout', getLogout);
appRouter.get('/bookinfo', getBookInfo)

appRouter.post(
  '/signup',
  [
    check('name').isLength({ min: 1 }).withMessage('Field name is required'),
    check('password')
      .isLength({ min: 1 })
      .withMessage('Field password is required'),
    check('email').isEmail().withMessage('Please enter a valid email'),
  ],
  setHeader,
  postSignupPage
);
appRouter.post(
  '/login',
  [
    check('password')
      .isLength({ min: 1 })
      .withMessage('Field password is required'),
    check('email').isEmail().withMessage('Please enter a valid email'),
  ],
  setHeader,
  postLogin,
);
