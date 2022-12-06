import { it, describe } from 'mocha';
import supertest from 'supertest';
import { app } from '../app';

describe('appRoutes', () => {
  describe('getHomePage', () => {
    let request = supertest(app).get('/');
    it('should return status 200', function (done) {
      request.expect(200).end(done);
    });
  });
  describe('getSignupPage', () => {
    let request = supertest(app).get('/signup');
    it('should return status 200', function (done) {
      request.expect(200).end(done);
    });
  });
  describe('getLogout', () => {
    let request = supertest(app).get('/logout');
    it('should return status 302', function (done) {
      request.expect(302).end(done);
    });
  });
  describe('getLogout', () => {
    let request = supertest(app).get('/login');
    it('should return status 200', function (done) {
      request.expect(200).end(done);
    });
  });
});
