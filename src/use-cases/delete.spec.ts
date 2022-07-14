import { makeDocument } from '../document';
import { Id } from '../Id';
import { makeFakeDocumentData } from '../__test__/fixtures/make-fake-document-data';
import { buildDeleteDocument } from './delete';

const dbDeleteMockFn = jest.fn();
const dbFindByIdMockFn = jest.fn();
const busPublishDocumentDeletionMockFn = jest.fn();
const deleteDocument = buildDeleteDocument({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because not all methods need to be mocked for this test
  documentDb: {
    findById: dbFindByIdMockFn,
    delete: dbDeleteMockFn,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because not all methods need to be mocked for this test
  serviceBus: {
    publishDocumentDeletion: busPublishDocumentDeletionMockFn,
  },
});

beforeEach(() => {
  dbDeleteMockFn.mockClear();
  dbFindByIdMockFn.mockClear();
  busPublishDocumentDeletionMockFn.mockClear();
});

it('needs a valid id', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because of testing with invalid values
  await expect(deleteDocument({ _id: null, teamId: Id.makeId() })).rejects.toThrow('You must supply an id.');
  await expect(deleteDocument({ _id: 'invalid', teamId: Id.makeId() })).rejects.toThrow('You must supply a valid id.');
});

it('needs a valid team id', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because of testing with invalid values
  await expect(deleteDocument({ _id: Id.makeId(), teamId: null })).rejects.toThrow('You must supply a team id.');
  await expect(deleteDocument({ _id: Id.makeId(), teamId: 'invalid' })).rejects.toThrow(
    'You must supply a valid team id.',
  );
});

it('can delete a document', async () => {
  const mockReturnDocument = makeDocument(makeFakeDocumentData());
  dbFindByIdMockFn.mockReturnValueOnce(mockReturnDocument);

  await deleteDocument({ _id: mockReturnDocument.getId(), teamId: mockReturnDocument.getTeamId() });
  expect(dbDeleteMockFn.mock.calls.length).toBe(1);
  expect(dbDeleteMockFn.mock.calls[0][0]).toStrictEqual(mockReturnDocument.getId());
  expect(busPublishDocumentDeletionMockFn.mock.calls.length).toBe(1);
  expect(busPublishDocumentDeletionMockFn.mock.calls[0][0].getData()).toStrictEqual(mockReturnDocument.getData());
});

it("can't delete a document of another team", async () => {
  dbFindByIdMockFn.mockReturnValueOnce(makeDocument(makeFakeDocumentData()));
  const documentId = Id.makeId();
  const otherTeamId = Id.makeId();

  await expect(deleteDocument({ _id: documentId, teamId: otherTeamId })).rejects.toThrow(
    "You can't delete another team's documents.",
  );
  expect(dbDeleteMockFn.mock.calls.length).toBe(0);
  expect(busPublishDocumentDeletionMockFn.mock.calls.length).toBe(0);
  expect(dbFindByIdMockFn.mock.calls.length).toBe(1);
  expect(dbFindByIdMockFn.mock.calls[0][0]).toStrictEqual({ _id: documentId, teamId: otherTeamId });
});
