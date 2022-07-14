import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

export interface IdUtils {
  makeId: () => string;
  isValidId: (_id: string) => boolean;
}

export const Id: IdUtils = Object.freeze({
  makeId: () => uuidv4(),
  isValidId: (_id: string) => validator.isUUID(_id),
});
