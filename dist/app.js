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
exports.app = void 0;
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const path_1 = __importDefault(require("path"));
const appRoutes_1 = require("./routes/appRoutes");
const booksRoutes_1 = require("./routes/booksRoutes");
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
dotenv.config();
const USER = process.env.MONGO_USER;
const PASSWORD = process.env.MONGO_PASSWORD;
const PORT = process.env.PORT;
console.log(USER, PASSWORD, PORT);
const MONGODB_URI = `mongodb+srv://${USER}:${PASSWORD}@pierwszycluster.ram8q.mongodb.net/bookApiNode?authSource=admin&replicaSet=atlas-cx3nkc-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
exports.app = (0, express_1.default)();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'bookApiSession',
});
exports.app.use((0, express_session_1.default)({
    secret: 'NetguruSecret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));
exports.app.use((0, connect_flash_1.default)());
exports.app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    next();
});
exports.app.use(express_ejs_layouts_1.default);
exports.app.set('views', path_1.default.join(__dirname, 'views'));
exports.app.set('view engine', 'ejs');
exports.app.use(express_1.default.static(__dirname + '/public'));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use('/', appRoutes_1.appRouter);
exports.app.use('/', booksRoutes_1.bookRouter);
exports.app.use((err, req, res, next) => {
    res.json({ error: err.message });
});
mongoose_1.default.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.error('FAILED TO CONNECT TO MONGODB');
        console.error(err);
    }
    else {
        console.error('CONNECTED TO MONGODB');
        exports.app.listen(PORT, () => { });
    }
});
