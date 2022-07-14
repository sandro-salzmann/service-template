import { defekt } from 'defekt';

export class ForwardToUserError extends defekt({
  code: 'ForwardToUserError',
  defaultMessage: 'Unknown error.',
}) {}
