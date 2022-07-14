import { Request, Response } from 'express';
import { Authorization, HttpResponse } from '../http-controller/typings';
import { makeHttpResponse } from './make-http-response';

export interface HttpRequest {
  body?: unknown;
  query?: unknown;
  params?: unknown;
  authString?: string;
}

export type HttpRequestHandler<ResBody> = (
  httpRequest: HttpRequest,
  auth: Authorization,
) => Promise<HttpResponse<ResBody>>;

export const handleExpressRequest =
  (handleHttpRequest: HttpRequestHandler<unknown>) => async (req: Request, res: Response) => {
    try {
      const authString = req.get('Authorization');

      const httpRequest: HttpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
      };

      const { resBody, resHeaders, resStatusCode } = await makeHttpResponse({
        httpRequest,
        handleHttpRequest,
        authString,
      });

      res.set(resHeaders);
      if (resBody) res.status(resStatusCode).send(resBody);
      else res.sendStatus(resStatusCode);
    } catch (error) {
      res.status(500).send({ error: 'An unkown error occurred.' });
    }
  };
