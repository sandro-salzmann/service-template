import { MakeBusFn } from '.';
import { Document, DocumentData } from '../document/document.type';
import { XyzData } from '../document/xyz/xyz.type';

export interface ServiceBus {
  publishDocumentUpdate: (document: Document) => Promise<void>;
  publishDocumentDeletion: (document: Document) => Promise<void>;
  subscribeXyzUpdates: (onMsg: (msg: XyzData) => Promise<void>) => Promise<void>;
  subscribeXyzDeletions: (onMsg: (msg: XyzData) => Promise<void>) => Promise<void>;
  answerSomeOtherCall: (onMsg: (msg: XyzData) => Promise<DocumentData>) => Promise<void>;
  subscribeSomeEvent: (onMsg: (msg: XyzData) => Promise<void>) => Promise<void>;
  callSomeProcedure: (payload: Document) => Promise<XyzData>;
  publishSomething: (payload: Document) => Promise<void>;
}

type MakeServiceBusFn = (props: { makeBus: MakeBusFn }) => ServiceBus;

export const makeServiceBus: MakeServiceBusFn = ({ makeBus }) => {
  const bus = makeBus();

  return {
    publishDocumentUpdate: async (document) => {
      await bus.publish<DocumentData>('document.updated', document.getData());
    },
    publishDocumentDeletion: async (document) => {
      await bus.publish<DocumentData>('document.deleted', document.getData());
    },
    subscribeXyzUpdates: async (onMsg) => {
      await bus.subscribe<XyzData>('xyzCollection.updated', onMsg);
    },
    subscribeXyzDeletions: async (onMsg) => {
      await bus.subscribe<XyzData>('xyzCollection.deleted', onMsg);
    },
    callSomeProcedure: async (document) => {
      return await bus.call<DocumentData, XyzData>('get-xyz-by-document', document.getData());
    },
    answerSomeOtherCall: async (onMsg) => {
      await bus.answer<XyzData, DocumentData>('get-document-by-xyz', onMsg);
    },
    publishSomething: async (document) => {
      await bus.publish<DocumentData>('document.something', document.getData());
    },
    subscribeSomeEvent: async (onMsg) => {
      await bus.subscribe<XyzData>('xyz.something', onMsg);
    },
  };
};
