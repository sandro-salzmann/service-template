import { ServiceBus } from '../bus-access/service-bus';
import { DocumentDb } from '../data-access/document-db';
import { Id } from '../Id';

export type DeleteDocumentFn = (props: { _id: string; teamId: string }) => Promise<void>;
type BuildDeleteDocumentFn = (props: { documentDb: DocumentDb; serviceBus: ServiceBus }) => DeleteDocumentFn;

export const buildDeleteDocument: BuildDeleteDocumentFn =
  ({ documentDb, serviceBus }) =>
  async ({ _id, teamId }) => {
    if (!_id) {
      throw new Error('You must supply an id.');
    }
    if (!Id.isValidId(_id)) {
      throw new Error('You must supply a valid id.');
    }
    if (!teamId) {
      throw new Error('You must supply a team id.');
    }
    if (!Id.isValidId(teamId)) {
      throw new Error('You must supply a valid team id.');
    }

    const document = await documentDb.findById({ _id, teamId });

    if (teamId !== document.getTeamId()) {
      throw new Error("You can't delete another team's documents.");
    }

    await documentDb.delete(_id);
    await serviceBus.publishDocumentDeletion(document);
  };
