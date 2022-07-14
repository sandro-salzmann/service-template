import { makeFakeAuthData } from '../__test__/fixtures/make-fake-auth-data';
import { makeFakeDocumentData } from '../__test__/fixtures/make-fake-document-data';
import { makeGetDocument } from './get';

const listDocumentMock = jest.fn();

beforeEach(() => {
  listDocumentMock.mockClear();
});

it('should get a document', async () => {
  const documentData = makeFakeDocumentData();
  const getDocument = makeGetDocument({
    listDocument: listDocumentMock,
  });
  const request = {
    headers: { 'Content-Type': 'application/json' },
    params: { _id: documentData._id },
  };
  const expected = {
    headers: { 'Content-Type': 'application/json' },
    statusCode: 200,
    body: documentData,
  };
  const authData = makeFakeAuthData();
  listDocumentMock.mockReturnValueOnce(documentData);
  const actual = await getDocument(request, authData);
  expect(actual).toEqual(expected);
  expect(listDocumentMock.mock.calls.length).toBe(1);
  expect(listDocumentMock.mock.calls[0][0]).toStrictEqual({
    _id: documentData._id,
    teamId: authData.accountId,
  });
});

it('should not get a document without a valid id', async () => {
  const getDocument = makeGetDocument({
    listDocument: listDocumentMock,
  });

  const invalidParams = [
    null,
    undefined,
    'invalid',
    { _id: null },
    { _id: undefined },
    { id: null },
    { _id: 'invalid' },
  ];
  for (let i = 0; i < invalidParams.length; i++) {
    const invalidParam = invalidParams[i];

    const request = {
      headers: { 'Content-Type': 'application/json' },
      params: invalidParam,
    };
    await expect(getDocument(request, makeFakeAuthData())).rejects.toThrow('You need to supply an id.');
    expect(listDocumentMock.mock.calls.length).toBe(0);
  }
});
