import { listDocument } from '../use-cases';
import { makeGetDocument } from './get';

export const getDocument = makeGetDocument({ listDocument });
