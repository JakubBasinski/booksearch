"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSignupPage = void 0;
const user_1 = require("src/models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const postSignupPage = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    try {
        const isUser = await user_1.User.findOne({ email: email });
        if (isUser) {
            return res.status(302);
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
            return res.status(302).redirect('/logout');
        }
    }
    catch (err) {
        next(err);
        return err;
    }
};
exports.postSignupPage = postSignupPage;
