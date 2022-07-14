import { serviceBus } from '../bus-access';
import { documentDb } from '../data-access';
import { buildSomeEventHandler } from './handle-some-event';
import { buildXyzDeletionHandler } from './handle-xyz-deletion';
import { buildXyzUpdateHandler } from './handle-xyz-update';
import { buildListDocument } from './list';
import { buildSomeOtherCallHandler } from './handle-some-other-call';
import { buildUpdateDocument } from './update';

export const listDocument = buildListDocument({ documentDb, serviceBus });
export const updateDocument = buildUpdateDocument({ documentDb, serviceBus });
export const handleXyzUpdate = buildXyzUpdateHandler({ documentDb });
export const handleXyzDeletion = buildXyzDeletionHandler({ documentDb });
export const handleSomeOtherCall = buildSomeOtherCallHandler();
export const handleSomeEvent = buildSomeEventHandler();
