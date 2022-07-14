import { faker } from '@faker-js/faker';
import { XyzData } from '../../document/xyz/xyz.type';
import { Id } from '../../Id';

export const makeFakeXyzData = (override = {}): XyzData => ({
  _id: Id.makeId(),
  name: faker.internet.userName(),
  ...override,
});
