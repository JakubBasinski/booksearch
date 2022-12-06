"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const sinon_1 = __importDefault(require("sinon"));
const chai_1 = require("chai");
const isAuthIsoleted_1 = require("./units/isAuthIsoleted");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('authorization middlewre', () => {
    it('shouldn`t throw error when header and JWT is valid  ', () => {
        const mockRequest = {
            session: {
                token: 'validToken',
            },
        };
        const mockResponse = {};
        sinon_1.default.stub(jsonwebtoken_1.default, 'verify');
        jsonwebtoken_1.default.verify.returns({
            email: 't@t1.pl',
        });
        (0, chai_1.expect)(isAuthIsoleted_1.isAuth.bind(this, mockRequest, mockResponse, () => { })).not.to.throw();
        jsonwebtoken_1.default.verify.restore();
    });
    it('should throw when the token is undefined', () => {
        const mockRequest = {
            session: {
                token: undefined,
            },
        };
        const mockResponse = {};
        sinon_1.default.stub(jsonwebtoken_1.default, 'verify');
        jsonwebtoken_1.default.verify.returns({
            email: 't@t1.pl',
        });
        (0, chai_1.expect)(isAuthIsoleted_1.isAuth.bind(this, mockRequest, mockResponse, () => { })).to.throw('Error: Not authenticated.');
        jsonwebtoken_1.default.verify.restore();
    });
    it('should throw when jwt.validate return false ', () => {
        const mockRequest = {
            session: {
                token: 'Valid token',
            },
        };
        const mockResponse = {};
        sinon_1.default.stub(jsonwebtoken_1.default, 'verify');
        jsonwebtoken_1.default.verify.returns(false);
        (0, chai_1.expect)(isAuthIsoleted_1.isAuth.bind(this, mockRequest, mockResponse, () => { })).to.throw('Error: Not authenticated.');
        jsonwebtoken_1.default.verify.restore();
    });
});
