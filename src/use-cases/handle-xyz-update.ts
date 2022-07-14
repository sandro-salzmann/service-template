import { DocumentDb } from '../data-access/document-db';
import { XyzData } from '../document/xyz/xyz.type';

export type XyzUpdateHandler = (xyz: XyzData) => Promise<void>;
type BuildXyzUpdateHandlerFn = (props: { documentDb: DocumentDb }) => XyzUpdateHandler;

export const buildXyzUpdateHandler: BuildXyzUpdateHandlerFn =
  ({ documentDb }) =>
  async (xyz) => {
    await documentDb.updateXyz(xyz);
  };
