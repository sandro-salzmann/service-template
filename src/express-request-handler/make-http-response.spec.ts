import { ForwardToUserError } from '../errors';
import { makeFakeAuthData } from '../__test__/fixtures/make-fake-auth-data';
import { makeHttpResponse } from './make-http-response';

it('should report errors that were meant for users from auth', async () => {
  const httpResponse = await makeHttpResponse({
    httpRequest: {},
    handleHttpRequest: async () => {
      return {
        body: {},
        statusCode: 400,
        headers: {},
      };
    },
    authString: 'invalid',
  });
  expect(httpResponse).toStrictEqual({
    resHeaders: { 'Content-Type': 'application/json' },
    resStatusCode: 401,
    resBody: { error: 'Authorization is not valid JSON.' },
  });
});

it('should report errors that were meant for users from usecase', async () => {
  const httpResponse = await makeHttpResponse({
    httpRequest: {},
    handleHttpRequest: async () => {
      throw new ForwardToUserError('something something error');
    },
    authString: JSON.stringify(makeFakeAuthData()),
  });
  expect(httpResponse).toStrictEqual({
    resHeaders: { 'Content-Type': 'application/json' },
    resStatusCode: 400,
    resBody: { error: 'something something error' },
  });
});

it('should report errors that were meant for users from usecase with statuscode', async () => {
  const httpResponse = await makeHttpResponse({
    httpRequest: {},
    handleHttpRequest: async () => {
      throw new ForwardToUserError({ message: 'something something error', data: { statusCode: 427 } });
    },
    authString: JSON.stringify(makeFakeAuthData()),
  });
  expect(httpResponse).toStrictEqual({
    resHeaders: { 'Content-Type': 'application/json' },
    resStatusCode: 427,
    resBody: { error: 'something something error' },
  });
});

it('should not report internal errors from usecase', async () => {
  const httpResponse = await makeHttpResponse({
    httpRequest: {},
    handleHttpRequest: async () => {
      throw new Error('internal stuff');
    },
    authString: JSON.stringify(makeFakeAuthData()),
  });
  expect(httpResponse).toStrictEqual({
    resHeaders: { 'Content-Type': 'application/json' },
    resStatusCode: 500,
    resBody: { error: 'An unknown error occured.' },
  });
});

it('should return successfully when no errors occured and default to json headers', async () => {
  const httpResponse = await makeHttpResponse({
    httpRequest: {},
    handleHttpRequest: async () => {
      return {
        statusCode: 201,
        body: { hi: 'hi!' },
      };
    },
    authString: JSON.stringify(makeFakeAuthData()),
  });
  expect(httpResponse).toStrictEqual({
    resHeaders: { 'Content-Type': 'application/json' },
    resStatusCode: 201,
    resBody: { hi: 'hi!' },
  });
});

it('should use defaults', async () => {
  const httpResponse = await makeHttpResponse({
    httpRequest: {},
    handleHttpRequest: async () => {
      return {};
    },
    authString: JSON.stringify(makeFakeAuthData()),
  });
  expect(httpResponse).toStrictEqual({
    resHeaders: { 'Content-Type': 'application/json' },
    resStatusCode: 200,
    resBody: {},
  });
});

it('should be able to set text headers', async () => {
  const httpResponse = await makeHttpResponse({
    httpRequest: {},
    handleHttpRequest: async () => {
      return {
        statusCode: 200,
        body: 'hello',
        headers: { 'Content-Type': 'application/text' },
      };
    },
    authString: JSON.stringify(makeFakeAuthData()),
  });
  expect(httpResponse).toStrictEqual({
    resHeaders: { 'Content-Type': 'application/text' },
    resStatusCode: 200,
    resBody: 'hello',
  });
});
