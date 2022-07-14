import { ServiceBus } from '../bus-access/service-bus';
import { DocumentDb } from '../data-access/document-db';
import { DocumentData } from '../document/document.type';
import { ForwardToUserError } from '../errors';
import { Id } from '../Id';

export type ListDocumentFn = (props: { _id: string; teamId: string }) => Promise<DocumentData>;
type BuildListDocumentFn = (props: { documentDb: DocumentDb; serviceBus: ServiceBus }) => ListDocumentFn;

export const buildListDocument: BuildListDocumentFn =
  ({ documentDb, serviceBus }) =>
  async ({ _id, teamId }) => {
    if (!_id) {
      throw new ForwardToUserError('You must supply an id.');
    }
    if (!Id.isValidId(_id)) {
      throw new ForwardToUserError('You must supply a valid id.');
    }
    if (!teamId) {
      throw new ForwardToUserError('You must supply a team id.');
    }
    if (!Id.isValidId(teamId)) {
      throw new ForwardToUserError('You must supply a valid team id.');
    }

    const document = await documentDb.findById({ _id, teamId });

    // publish something
    serviceBus.publishSomething(document);

    return document.getData();
  };
