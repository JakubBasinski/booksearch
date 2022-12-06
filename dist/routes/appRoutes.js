"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const express_1 = __importDefault(require("express"));
const setHeaders_1 = require("../middleware/setHeaders");
const express_validator_1 = require("express-validator");
const appController_1 = require("../controllers/appController");
exports.appRouter = express_1.default.Router();
exports.appRouter.get('', appController_1.getHomePage);
exports.appRouter.get('/signup', appController_1.getSignupPage);
exports.appRouter.get('/login', appController_1.getLoginPage);
exports.appRouter.get('/logout', appController_1.getLogout);
exports.appRouter.get('/bookinfo', appController_1.getBookInfo);
exports.appRouter.post('/signup', [
    (0, express_validator_1.check)('name').isLength({ min: 1 }).withMessage('Field name is required'),
    (0, express_validator_1.check)('password')
        .isLength({ min: 1 })
        .withMessage('Field password is required'),
    (0, express_validator_1.check)('email').isEmail().withMessage('Please enter a valid email'),
], setHeaders_1.setHeader, appController_1.postSignupPage);
exports.appRouter.post('/login', [
    (0, express_validator_1.check)('password')
        .isLength({ min: 1 })
        .withMessage('Field password is required'),
    (0, express_validator_1.check)('email').isEmail().withMessage('Please enter a valid email'),
], setHeaders_1.setHeader, appController_1.postLogin);
