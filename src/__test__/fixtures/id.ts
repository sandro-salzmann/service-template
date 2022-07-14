import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

export const Id = Object.freeze({
  makeId: () => uuidv4(),
  isValidId: (string: string) => validator.isUUID(string),
});
