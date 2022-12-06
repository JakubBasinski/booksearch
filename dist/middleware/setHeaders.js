"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHeader = void 0;
const setHeader = (req, res, next) => {
    try {
        const token = req.session.token;
        if (token) {
            res.setHeader('Authorization', token);
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        next();
    }
    catch (err) {
        const error = new Error(err);
        return next(error);
    }
};
exports.setHeader = setHeader;
