import { WithId } from 'mongodb';
import { ForwardToUserError } from '../errors';
import { IdUtils } from '../Id';
import { Document, DocumentData } from './document.type';
import { makeXyz } from './xyz';

type BuildMakeDocumentFn = (props: {
  Id: IdUtils;
  sanitizeText: (text: string) => string;
}) => (props: DocumentData | WithId<DocumentData>) => Document;

export const buildMakeDocument: BuildMakeDocumentFn =
  ({ Id, sanitizeText }) =>
  ({ _id = Id.makeId(), teamId, name, myXyzData }) => {
    const validateId = (text?: string) => {
      if (!text || !Id.isValidId(text)) {
        throw new ForwardToUserError('Document must have a valid id.');
      }
      return text;
    };
    const validateTeamId = (text?: string) => {
      if (!text || !Id.isValidId(text)) {
        throw new ForwardToUserError('Document must have a valid team id.');
      }
      return text;
    };
    const validateName = (text: string) => {
      if (!text) {
        throw new ForwardToUserError('Document must have a name.');
      }
      name = sanitizeText(text);
      if (name.length < 1) {
        throw new ForwardToUserError('Name contains no usable text.');
      }
      return name;
    };

    _id = validateId(_id);
    teamId = validateTeamId(teamId);
    name = validateName(name);
    const myXyz = myXyzData ? makeXyz(myXyzData) : null;

    return {
      getId: () => _id,
      getName: () => name,
      setName: (newName: string) => {
        name = validateName(newName);
      },
      getTeamId: () => teamId,
      getMyXyz: () => myXyz,
      getData: () => ({
        _id,
        name,
        teamId,
        myXyzData: myXyz ? myXyz.getData() : null,
      }),
    } as const;
  };
