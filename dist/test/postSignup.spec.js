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
//@ts-nocheck
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const user_1 = require("src/models/user");
const postSignup_1 = require("./units/postSignup");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
describe('App Controllers', () => {
    describe('Post signup Page', () => {
        it('should return status 302 if user is already defined', function (done) {
            const mockRequest = {
                body: {
                    email: 'test@t.pl',
                    password: 'secret',
                    name: 'Arnold',
                },
            };
            const mockResponse = {
                statusCode: 500,
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
            };
            const next = () => { };
            sinon_1.default.stub(user_1.User, 'findOne');
            user_1.User.findOne.returns({ email: 'email' });
            (0, postSignup_1.postSignupPage)(mockRequest, mockResponse, next)
                .then((result) => {
                (0, chai_1.expect)(result.statusCode).to.equal(302);
                done();
            })
                .catch((err) => {
                done(err);
            });
            user_1.User.findOne.restore();
        });
    });
});
