import { ServiceBus } from '../bus-access/service-bus';
import { DocumentDb } from '../data-access/document-db';
import { DocumentData } from '../document/document.type';
import { Id } from '../Id';

export type UpdateDocumentFn = (props: { documentData: DocumentData; teamId: string }) => Promise<void>;
type BuildUpdateDocumentFn = (props: { documentDb: DocumentDb; serviceBus: ServiceBus }) => UpdateDocumentFn;

export const buildUpdateDocument: BuildUpdateDocumentFn =
  ({ documentDb, serviceBus }) =>
  async ({ documentData, teamId }) => {
    if (!documentData?._id) {
      throw new Error('You must supply a document id.');
    }
    if (!Id.isValidId(documentData._id)) {
      throw new Error('You must supply a valid document id.');
    }
    if (!teamId) {
      throw new Error('You must supply a team id.');
    }
    if (!Id.isValidId(teamId)) {
      throw new Error('You must supply a valid team id.');
    }

    const document = await documentDb.findById({ _id: documentData._id, teamId });

    if (teamId !== document.getTeamId()) {
      throw new Error("You can't update another team's documents.");
    }

    document.setName(documentData.name);

    await documentDb.update(document);
    await serviceBus.publishDocumentUpdate(document);
  };
