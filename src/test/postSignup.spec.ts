//@ts-nocheck
import { expect } from 'chai';
import sinon from 'sinon';
import { User } from 'src/models/user';
import { postSignupPage } from './units/postSignup';
import * as dotenv from 'dotenv';
dotenv.config();

describe('App Controllers', () => {
  describe('Post signup Page', () => {
    it('should return status 302 if user is already defined', function (done) {
      const mockRequest: Partial<Request> = {
        body: {
          email: 'test@t.pl',
          password: 'secret',
          name: 'Arnold',
        },
      };
      const mockResponse: Partial<Response> = {
        statusCode: 500,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
      };
      const next = () => {};
      sinon.stub(User, 'findOne');
      User.findOne.returns({ email: 'email' });

      postSignupPage(mockRequest, mockResponse, next)
        .then((result) => {
          expect(result.statusCode).to.equal(302);
          done();
        })
        .catch((err) => {
          done(err);
        });
      User.findOne.restore();
    });
  });
});
