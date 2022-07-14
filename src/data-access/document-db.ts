import { flaschenpost } from 'flaschenpost';
import { MakeDbFn } from '.';
import { makeDocument } from '../document';
import { Document, DocumentData } from '../document/document.type';
import { XyzData } from '../document/xyz/xyz.type';
import { ForwardToUserError } from '../errors';

const logger = flaschenpost.getLogger();

export interface DocumentDb {
  findById: (props: { teamId: string; _id: string }) => Promise<Document>;
  insert: (document: Document) => Promise<string>;
  update: (document: Document) => Promise<void>;
  delete: (_id: string) => Promise<void>;
  updateXyz: (xyz: XyzData) => Promise<void>;
  deleteXyz: (_id: string) => Promise<void>;
}
type MakeDocumentDbFn = (props: { makeDb: MakeDbFn }) => DocumentDb;

export const makeDocumentDb: MakeDocumentDbFn = ({ makeDb }) => ({
  insert: async (document): Promise<string> => {
    try {
      const db = await makeDb();

      const documentData = document.getData();

      const insertedDocumentData = await db.collection<DocumentData>('documents').insertOne(documentData);

      if (!insertedDocumentData.acknowledged) throw new Error('Inserted document not acknowledged.');

      return insertedDocumentData.insertedId.toString();
    } catch (error) {
      logger.debug('Failed to insert document.', { error });
      throw new ForwardToUserError('Failed to insert document.');
    }
  },
  findById: async ({ _id, teamId }): Promise<Document> => {
    try {
      const db = await makeDb();

      const documentData = await db.collection<DocumentData>('documents').findOne({ _id, teamId });

      if (!documentData) throw new Error('Document not found.');

      return makeDocument(documentData);
    } catch (error) {
      logger.debug('Failed to find document.', { error });
      throw new ForwardToUserError('Failed to find document.');
    }
  },
  update: async (document): Promise<void> => {
    try {
      const db = await makeDb();

      const documentData = document.getData();

      const newDocumentData = await db
        .collection<DocumentData>('documents')
        .updateOne({ _id: document.getId() }, { $set: documentData });

      if (newDocumentData.matchedCount !== 1) throw new Error('Document not found.');
      if (newDocumentData.modifiedCount !== 1) throw new Error('Document not updated successfully.');
    } catch (error) {
      logger.debug('Failed to update document.', { error });
      throw new ForwardToUserError('Failed to update Document.');
    }
  },
  delete: async (_id): Promise<void> => {
    try {
      const db = await makeDb();

      const deleteResult = await db.collection<DocumentData>('documents').deleteOne({ _id });

      if (deleteResult.deletedCount !== 1) throw new Error('Document not deleted.');
    } catch (error) {
      logger.debug('Failed to delete document.', { error });
      throw new ForwardToUserError('Failed to delete document.');
    }
  },
  updateXyz: async (xyz): Promise<void> => {
    try {
      const db = await makeDb();

      await db
        .collection<DocumentData>('documents')
        .updateMany({ 'myXyzData._id': xyz._id }, { $set: { myXyzData: xyz } });
    } catch (error) {
      logger.debug('Failed to update xyz.', { error });
      throw new ForwardToUserError('Failed to update xyz.');
    }
  },
  deleteXyz: async (_id): Promise<void> => {
    try {
      const db = await makeDb();

      await db
        .collection<DocumentData>('documents')
        .updateMany({ 'myXyzData._id': _id }, { $unset: { myXyzData: true } });
    } catch (error) {
      logger.debug('Failed to delete xyz.', { error });
      throw new ForwardToUserError('Failed to delete xyz.');
    }
  },
});
