import { makeDocument } from '.';
import { makeFakeDocumentData } from '../__test__/fixtures/make-fake-document-data';

it('must have a valid id', () => {
  const nullId = makeFakeDocumentData({ _id: null });
  expect(() => makeDocument(nullId)).toThrow('Document must have a valid id.');
  const invalidId = makeFakeDocumentData({ _id: 'invalid' });
  expect(() => makeDocument(invalidId)).toThrow('Document must have a valid id.');
});

it('must have a valid team id', () => {
  const nullId = makeFakeDocumentData({ teamId: null });
  expect(() => makeDocument(nullId)).toThrow('Document must have a valid team id.');
  const invalidId = makeFakeDocumentData({ teamId: 'invalid' });
  expect(() => makeDocument(invalidId)).toThrow('Document must have a valid team id.');
});

it('must have a name', () => {
  const nullName = makeFakeDocumentData({ name: null });
  expect(() => makeDocument(nullName)).toThrow('Document must have a name.');
  const emptyName = makeFakeDocumentData({ name: undefined });
  expect(() => makeDocument(emptyName)).toThrow('Document must have a name.');
});

it('must sanitize the name', () => {
  const htmlEmptyName = makeFakeDocumentData({
    name: '<svg><g/onload=alert(2)//<p>',
  });
  expect(() => makeDocument(htmlEmptyName)).toThrow('Name contains no usable text.');
});

it('should default xyz to null', () => {
  const undefinedXyz = makeFakeDocumentData({ myXyzData: undefined });
  expect(makeDocument(undefinedXyz).getMyXyz()).toBeNull();
});

it('should validate xyz', () => {
  const undefinedXyz = makeFakeDocumentData({ myXyzData: { _id: 'invalid' } });
  expect(() => makeDocument(undefinedXyz)).toThrow('Xyz must have a valid id.');
});
