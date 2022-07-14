import { faker } from '@faker-js/faker';
import { DocumentData } from '../../document/document.type';
import { Id } from '../../Id';

export const makeFakeDocumentData = (override = {}): DocumentData => ({
  _id: Id.makeId(),
  name: faker.internet.userName(),
  teamId: Id.makeId(),
  myXyzData: { _id: Id.makeId(), name: faker.internet.userName() },
  ...override,
});
