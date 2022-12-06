// @ts-nocheck
import sinon from 'sinon';
import { expect } from 'chai';
import { isAuth } from './units/isAuthIsoleted';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

describe('authorization middlewre', () => {
  it('shouldn`t throw error when header and JWT is valid  ', () => {
    const mockRequest: Partial<Request> = {
      session: {
        token: 'validToken',
      },
    };
    const mockResponse: Partial<Response> = {};
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({
      email: 't@t1.pl',
    });
    expect(
      isAuth.bind(this, mockRequest, mockResponse, () => {})
    ).not.to.throw();
    jwt.verify.restore(); 
  });

  it('should throw when the token is undefined', () => {
    const mockRequest: Partial<Request> = {
      session: {
        token: undefined,
      },
    };
    const mockResponse: Partial<Response> = {};
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({
      email: 't@t1.pl',
    });
    expect(isAuth.bind(this, mockRequest, mockResponse, () => {})).to.throw(
      'Error: Not authenticated.'
    );
    jwt.verify.restore();
  });

  it('should throw when jwt.validate return false ', () => {
    const mockRequest: Partial<Request> = {
      session: {
        token: 'Valid token',
      },
    };
    const mockResponse: Partial<Response> = {};
    sinon.stub(jwt, 'verify');
    jwt.verify.returns(false);
    expect(isAuth.bind(this, mockRequest, mockResponse, () => {})).to.throw(
      'Error: Not authenticated.'
    );
    jwt.verify.restore();
  });
});
