import { Authorization } from '../../http-controller/typings';
import { Id } from './id';

export const makeFakeAuthData = (override = {}): Authorization => ({
  accountId: Id.makeId(),
  ...override,
});
