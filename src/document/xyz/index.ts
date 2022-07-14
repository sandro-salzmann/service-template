import { Id } from '../../Id';
import { sanitizeText } from '../../Sanitizers/sanitizeText';
import { buildMakeXyz } from './xyz';

export const makeXyz = buildMakeXyz({ Id, sanitizeText });
