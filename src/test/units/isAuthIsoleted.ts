//@ts-nocheck

import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const isAuth: RequestHandler = (req, res, next) => {
  try {
    const token = req.session.token;
    let decodedToken;
    if (token) {
      decodedToken = jwt.verify(token!, process.env.TOKEN_SECRET as string);
    }
    if (!decodedToken) {
      const error = new Error('Not authenticated.');
      throw error;
    }
    next();
  } catch (err: any) {
    throw Error(err);
  }
};
