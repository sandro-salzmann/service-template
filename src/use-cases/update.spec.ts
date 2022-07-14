import { makeDocument } from '../document';
import { Id } from '../Id';
import { makeFakeDocumentData } from '../__test__/fixtures/make-fake-document-data';
import { buildUpdateDocument } from './update';

const dbUpdateMockFn = jest.fn();
const dbFindByIdMockFn = jest.fn();
const busPublishUpdateMockFn = jest.fn();
const updateDocument = buildUpdateDocument({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because not all methods need to be mocked for this test
  documentDb: {
    update: dbUpdateMockFn,
    findById: dbFindByIdMockFn,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because not all methods need to be mocked for this test
  serviceBus: {
    publishDocumentUpdate: busPublishUpdateMockFn,
  },
});

beforeEach(() => {
  dbUpdateMockFn.mockClear();
  busPublishUpdateMockFn.mockClear();
  dbFindByIdMockFn.mockClear();
});

it('needs a valid documentData', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because of testing with invalid values
  await expect(updateDocument({ documentData: null, teamId: Id.makeId() })).rejects.toThrow(
    'You must supply a document id.',
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because of testing with invalid values
  await expect(updateDocument({ documentData: 'invalid', teamId: Id.makeId() })).rejects.toThrow(
    'You must supply a document id.',
  );
});

it('needs a valid document data id', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because of testing with invalid values
  await expect(updateDocument({ documentData: { _id: null }, teamId: Id.makeId() })).rejects.toThrow(
    'You must supply a document id.',
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because of testing with invalid values
  await expect(updateDocument({ documentData: { _id: 'invalid' }, teamId: Id.makeId() })).rejects.toThrow(
    'You must supply a valid document id.',
  );
});

it('needs a valid team id', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore because of testing with invalid values
  await expect(updateDocument({ documentData: makeFakeDocumentData(), teamId: null })).rejects.toThrow(
    'You must supply a team id.',
  );
  await expect(updateDocument({ documentData: makeFakeDocumentData(), teamId: 'invalid' })).rejects.toThrow(
    'You must supply a valid team id.',
  );
});

it('can update a document', async () => {
  const documentData = makeFakeDocumentData();
  dbFindByIdMockFn.mockReturnValueOnce(makeDocument(documentData));
  await updateDocument({ documentData, teamId: documentData.teamId });
  expect(dbUpdateMockFn.mock.calls.length).toBe(1);
  expect(dbUpdateMockFn.mock.calls[0][0].getData()).toStrictEqual(makeDocument(documentData).getData());
  expect(busPublishUpdateMockFn.mock.calls.length).toBe(1);
  expect(busPublishUpdateMockFn.mock.calls[0][0].getData()).toStrictEqual(makeDocument(documentData).getData());
});

it("can't update a document that doesn't exist", async () => {
  const documentData = makeFakeDocumentData();
  dbFindByIdMockFn.mockImplementationOnce(() => {
    throw new Error('Document not found.');
  });
  await expect(updateDocument({ documentData, teamId: documentData.teamId })).rejects.toThrow('Document not found.');
  expect(dbUpdateMockFn.mock.calls.length).toBe(0);
  expect(busPublishUpdateMockFn.mock.calls.length).toBe(0);
});

it("can't update a document of another team", async () => {
  dbFindByIdMockFn.mockReturnValueOnce(makeDocument(makeFakeDocumentData()));
  const documentData = makeFakeDocumentData();
  const otherTeamId = Id.makeId();
  await expect(updateDocument({ documentData, teamId: otherTeamId })).rejects.toThrow(
    "You can't update another team's documents.",
  );
  expect(dbUpdateMockFn.mock.calls.length).toBe(0);
  expect(busPublishUpdateMockFn.mock.calls.length).toBe(0);
  expect(dbFindByIdMockFn.mock.calls.length).toBe(1);
  expect(dbFindByIdMockFn.mock.calls[0][0]).toStrictEqual({ _id: documentData._id, teamId: otherTeamId });
});
