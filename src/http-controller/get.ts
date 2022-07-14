import Joi from 'joi';
import { DocumentData } from '../document/document.type';
import { ForwardToUserError } from '../errors';
import { HttpRequestHandler } from '../express-request-handler';
import { ListDocumentFn } from '../use-cases/list';

type MakeGetDocumentFn = ({ listDocument }: { listDocument: ListDocumentFn }) => HttpRequestHandler<DocumentData>;

export const makeGetDocument: MakeGetDocumentFn =
  ({ listDocument }) =>
  async (httpRequest, authorization) => {
    const headers = { 'Content-Type': 'application/json' };

    // validate id
    const validator = Joi.object<{ _id: string }>()
      .keys({
        _id: Joi.string().uuid({ version: 'uuidv4' }).required(),
      })
      .required()
      .unknown(false);

    const { value: validatedParams, error } = validator.validate(httpRequest.params);

    if (error) {
      throw new ForwardToUserError('You need to supply an id.');
    }

    const document = await listDocument({
      _id: validatedParams._id,
      teamId: authorization.accountId,
    });

    return {
      headers,
      statusCode: 200,
      body: document,
    };
  };
