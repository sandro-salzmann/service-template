import { makeDocument } from '../document';
import { Id } from '../Id';
import { makeFakeDocumentData } from '../__test__/fixtures/make-fake-document-data';
import { useInMemoryDb } from '../__test__/fixtures/use-in-memory-db';
import { makeDocumentDb } from './document-db';

const { makeDb } = useInMemoryDb();

const documentDb = makeDocumentDb({ makeDb });

it('should insert and find a document', async () => {
  const document = makeDocument(makeFakeDocumentData());

  await documentDb.insert(document);

  const foundDocument = await documentDb.findById({ _id: document.getId(), teamId: document.getTeamId() });
  expect(foundDocument.getData()).toStrictEqual(document.getData());
});

it('should not insert a document when another document with the same id already exists', async () => {
  const document = makeDocument(makeFakeDocumentData());

  await documentDb.insert(document);

  await expect(documentDb.insert(document)).rejects.toThrow('Failed to insert document.');
});

it('should not find a document that is not stored', async () => {
  const document = makeDocument(makeFakeDocumentData());

  await documentDb.insert(document);

  await expect(documentDb.findById({ _id: Id.makeId(), teamId: document.getTeamId() })).rejects.toThrow(
    'Failed to find document.',
  );
});

it('should not find a document owned by another team', async () => {
  const document = makeDocument(makeFakeDocumentData());

  await documentDb.insert(document);

  await expect(documentDb.findById({ _id: document.getId(), teamId: Id.makeId() })).rejects.toThrow(
    'Failed to find document.',
  );
});

it('should update a document', async () => {
  const document = makeDocument(makeFakeDocumentData());
  const modifiedDocument = makeDocument({ ...document.getData(), name: 'new-name' });

  await documentDb.insert(document);
  await documentDb.update(modifiedDocument);

  const foundDocument = await documentDb.findById({ _id: document.getId(), teamId: document.getTeamId() });

  expect(foundDocument.getData()).toStrictEqual(modifiedDocument.getData());
});

it('should not update a document that does not exist', async () => {
  const document = makeDocument(makeFakeDocumentData());
  const modifiedDocument = makeDocument({ ...document.getData(), _id: Id.makeId() });

  await documentDb.insert(document);

  await expect(documentDb.update(modifiedDocument)).rejects.toThrow('Failed to update Document.');
});

it('should delete a document', async () => {
  const document = makeDocument(makeFakeDocumentData());

  await documentDb.insert(document);
  await documentDb.delete(document.getId());

  await expect(documentDb.findById({ _id: document.getId(), teamId: document.getTeamId() })).rejects.toThrow(
    'Failed to find document.',
  );
});

it('should not delete a document that does not exist', async () => {
  const document = makeDocument(makeFakeDocumentData());

  await documentDb.insert(document);

  await expect(documentDb.delete(Id.makeId())).rejects.toThrow('Failed to delete document.');
});

it('should update xyz', async () => {
  const originalXyz = { _id: Id.makeId(), name: 'old-name' };
  const document1 = makeDocument(makeFakeDocumentData({ myXyzData: originalXyz }));
  const document2 = makeDocument(makeFakeDocumentData());
  const document3 = makeDocument(makeFakeDocumentData({ myXyzData: originalXyz }));
  const document4 = makeDocument(makeFakeDocumentData());
  const document5 = makeDocument(makeFakeDocumentData());

  await documentDb.insert(document1);
  await documentDb.insert(document2);
  await documentDb.insert(document3);
  await documentDb.insert(document4);
  await documentDb.insert(document5);

  const updatedXyz = { ...originalXyz, name: 'new-name' };
  await documentDb.updateXyz(updatedXyz);

  const foundDocument1 = await documentDb.findById({ _id: document1.getId(), teamId: document1.getTeamId() });
  const foundDocument2 = await documentDb.findById({ _id: document2.getId(), teamId: document2.getTeamId() });
  const foundDocument3 = await documentDb.findById({ _id: document3.getId(), teamId: document3.getTeamId() });
  const foundDocument4 = await documentDb.findById({ _id: document4.getId(), teamId: document4.getTeamId() });
  const foundDocument5 = await documentDb.findById({ _id: document5.getId(), teamId: document5.getTeamId() });

  const modifiedDocument1 = makeDocument({ ...document1.getData(), myXyzData: updatedXyz });
  const modifiedDocument3 = makeDocument({ ...document3.getData(), myXyzData: updatedXyz });

  expect(foundDocument1.getData()).toStrictEqual(modifiedDocument1.getData());
  expect(foundDocument2.getData()).toStrictEqual(document2.getData());
  expect(foundDocument3.getData()).toStrictEqual(modifiedDocument3.getData());
  expect(foundDocument4.getData()).toStrictEqual(document4.getData());
  expect(foundDocument5.getData()).toStrictEqual(document5.getData());
});

it('should delete xyz', async () => {
  const originalXyz = { _id: Id.makeId(), name: 'my-name' };
  const document1 = makeDocument(makeFakeDocumentData({ myXyzData: originalXyz }));
  const document2 = makeDocument(makeFakeDocumentData());
  const document3 = makeDocument(makeFakeDocumentData({ myXyzData: originalXyz }));
  const document4 = makeDocument(makeFakeDocumentData());
  const document5 = makeDocument(makeFakeDocumentData());

  await documentDb.insert(document1);
  await documentDb.insert(document2);
  await documentDb.insert(document3);
  await documentDb.insert(document4);
  await documentDb.insert(document5);

  await documentDb.deleteXyz(originalXyz._id);

  const foundDocument1 = await documentDb.findById({ _id: document1.getId(), teamId: document1.getTeamId() });
  const foundDocument2 = await documentDb.findById({ _id: document2.getId(), teamId: document2.getTeamId() });
  const foundDocument3 = await documentDb.findById({ _id: document3.getId(), teamId: document3.getTeamId() });
  const foundDocument4 = await documentDb.findById({ _id: document4.getId(), teamId: document4.getTeamId() });
  const foundDocument5 = await documentDb.findById({ _id: document5.getId(), teamId: document5.getTeamId() });

  const modifiedDocument1 = makeDocument({ ...document1.getData(), myXyzData: null });
  const modifiedDocument3 = makeDocument({ ...document3.getData(), myXyzData: null });

  expect(foundDocument1.getData()).toStrictEqual(modifiedDocument1.getData());
  expect(foundDocument2.getData()).toStrictEqual(document2.getData());
  expect(foundDocument3.getData()).toStrictEqual(modifiedDocument3.getData());
  expect(foundDocument4.getData()).toStrictEqual(document4.getData());
  expect(foundDocument5.getData()).toStrictEqual(document5.getData());
});
