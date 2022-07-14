import { makeDocument } from '../document';
import { Id } from '../Id';
import { makeFakeDocumentData } from '../__test__/fixtures/make-fake-document-data';
import { buildListDocument } from './list';

const dbFindByIdMockFn = jest.fn();
const busPublishSomethingMockFn = jest.fn();
const listDocument = buildListDocument({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because not all methods need to be mocked for this test
  documentDb: {
    findById: dbFindByIdMockFn,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because not all methods need to be mocked for this test
  serviceBus: {
    publishSomething: busPublishSomethingMockFn,
  },
});

beforeEach(() => {
  dbFindByIdMockFn.mockClear();
  busPublishSomethingMockFn.mockClear();
});

it('needs a valid id', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because of testing with invalid values
  await expect(listDocument({ _id: null, teamId: Id.makeId() })).rejects.toThrow('You must supply an id.');
  await expect(listDocument({ _id: 'invalid', teamId: Id.makeId() })).rejects.toThrow('You must supply a valid id.');
});

it('needs a valid team id', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because of testing with invalid values
  await expect(listDocument({ _id: Id.makeId(), teamId: null })).rejects.toThrow('You must supply a team id.');
  await expect(listDocument({ _id: Id.makeId(), teamId: 'invalid' })).rejects.toThrow(
    'You must supply a valid team id.',
  );
});

it('can list a document', async () => {
  const mockReturnDocument = makeDocument(makeFakeDocumentData());
  dbFindByIdMockFn.mockReturnValueOnce(mockReturnDocument);

  await listDocument({ _id: mockReturnDocument.getId(), teamId: mockReturnDocument.getTeamId() });
  expect(dbFindByIdMockFn.mock.calls.length).toBe(1);
  expect(dbFindByIdMockFn.mock.calls[0][0]).toStrictEqual({
    _id: mockReturnDocument.getId(),
    teamId: mockReturnDocument.getTeamId(),
  });
  expect(busPublishSomethingMockFn.mock.calls.length).toBe(1);
  expect(busPublishSomethingMockFn.mock.calls[0][0].getData()).toStrictEqual(mockReturnDocument.getData());
});
