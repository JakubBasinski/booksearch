"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
(0, mocha_1.describe)('appRoutes', () => {
    (0, mocha_1.describe)('getHomePage', () => {
        let request = (0, supertest_1.default)(app_1.app).get('/');
        (0, mocha_1.it)('should return status 200', function (done) {
            request.expect(200).end(done);
        });
    });
    (0, mocha_1.describe)('getSignupPage', () => {
        let request = (0, supertest_1.default)(app_1.app).get('/signup');
        (0, mocha_1.it)('should return status 200', function (done) {
            request.expect(200).end(done);
        });
    });
    (0, mocha_1.describe)('getLogout', () => {
        let request = (0, supertest_1.default)(app_1.app).get('/logout');
        (0, mocha_1.it)('should return status 302', function (done) {
            request.expect(302).end(done);
        });
    });
    (0, mocha_1.describe)('getLogout', () => {
        let request = (0, supertest_1.default)(app_1.app).get('/login');
        (0, mocha_1.it)('should return status 200', function (done) {
            request.expect(200).end(done);
        });
    });
});
