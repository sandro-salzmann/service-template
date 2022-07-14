import Joi from 'joi';
import { ForwardToUserError } from '../errors';
import { Authorization } from '../http-controller/typings';

export const checkAuthString = (authString?: string) => {
  if (!authString) {
    throw new ForwardToUserError({ message: 'Missing authorization.', data: { statusCode: 401 } });
  }
  let authorization;
  try {
    authorization = JSON.parse(authString);
  } catch (error) {
    throw new ForwardToUserError({ message: 'Authorization is not valid JSON.', data: { statusCode: 401 } });
  }

  // validate authorization
  const validator = Joi.object<Authorization>()
    .keys({
      accountId: Joi.string().uuid({ version: 'uuidv4' }).required(),
    })
    .required()
    .unknown(false);

  const { value: validatedAuthorization, error } = validator.validate(authorization);

  if (error) {
    throw new ForwardToUserError({
      message: `Authorization validation error: ${error.message}`,
      data: { statusCode: 401 },
    });
  }
  if (!validatedAuthorization) {
    throw new ForwardToUserError({ message: 'Authorization validation failed.', data: { statusCode: 401 } });
  }

  return validatedAuthorization;
};
