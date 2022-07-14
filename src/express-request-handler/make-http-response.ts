import { isCustomError } from 'defekt';
import { HttpRequest, HttpRequestHandler } from '.';
import { ForwardToUserError } from '../errors';
import { checkAuthString } from './check-auth-string';

export const makeHttpResponse = async ({
  httpRequest,
  handleHttpRequest,
  authString,
}: {
  httpRequest: HttpRequest;
  authString?: string;
  handleHttpRequest: HttpRequestHandler<unknown>;
}) => {
  let resHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  let resStatusCode = 500;
  let resBody: unknown = { error: 'An unknown error occured.' };
  try {
    const auth = checkAuthString(authString);
    const httpResponse = await handleHttpRequest(httpRequest, auth);
    resHeaders = httpResponse.headers || { 'Content-Type': 'application/json' };
    resStatusCode = httpResponse.statusCode || 200;
    resBody = httpResponse.body || {};
  } catch (error: unknown) {
    if (isCustomError(error, ForwardToUserError)) {
      resStatusCode = error.data?.statusCode || 400;
      resBody = { error: error.message };
    }
  }

  return { resHeaders, resStatusCode, resBody };
};
