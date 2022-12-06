import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { appRouter } from './routes/appRoutes';
import { bookRouter } from './routes/booksRoutes';
import mongoose, { ConnectOptions } from 'mongoose';
import session from 'express-session';
import MongoDB from 'connect-mongodb-session';
import flash from 'connect-flash';

dotenv.config();

const USER = process.env.MONGO_USER;
const PASSWORD = process.env.MONGO_PASSWORD;
const PORT = process.env.PORT
console.log(USER, PASSWORD, PORT);

const MONGODB_URI = `mongodb+srv://${USER}:${PASSWORD}@pierwszycluster.ram8q.mongodb.net/bookApiNode?authSource=admin&replicaSet=atlas-cx3nkc-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;

const MongoDBStore = MongoDB(session);

export const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'bookApiSession',
});

declare module 'express-session' {
  export interface SessionData {
    isLoggedIn: boolean;
    user: any;
    token: string | undefined;
  }
}

app.use(
  session({
    secret: 'NetguruSecret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

app.use(( req: any, res: any, next: NextFunction) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  next();
});

app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', appRouter);
app.use('/', bookRouter);
app.use((err: Error, req: Request, res: any, next: NextFunction) => {
  res.json({ error: err.message });
});

mongoose.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions,
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.error('CONNECTED TO MONGODB');
      app.listen(PORT, (): void => {});
    }
  }
);
