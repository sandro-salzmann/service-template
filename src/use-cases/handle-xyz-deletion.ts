import { DocumentDb } from '../data-access/document-db';
import { XyzData } from '../document/xyz/xyz.type';

export type XyzDeletionHandler = (xyz: XyzData) => Promise<void>;
type BuildXyzDeletionHandlerFn = (props: { documentDb: DocumentDb }) => XyzDeletionHandler;

export const buildXyzDeletionHandler: BuildXyzDeletionHandlerFn =
  ({ documentDb }) =>
  async (xyz) => {
    await documentDb.deleteXyz(xyz._id);
  };
