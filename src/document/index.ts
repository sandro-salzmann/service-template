import { Id } from '../Id';
import { sanitizeText } from '../Sanitizers/sanitizeText';
import { buildMakeDocument } from './document';

export const makeDocument = buildMakeDocument({ Id, sanitizeText });
