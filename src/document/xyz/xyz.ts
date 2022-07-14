import { WithId } from 'mongodb';
import { ForwardToUserError } from '../../errors';
import { IdUtils } from '../../Id';
import { Xyz, XyzData } from './xyz.type';

type BuildMakeXyzFn = (props: {
  Id: IdUtils;
  sanitizeText: (text: string) => string;
}) => (props: XyzData | WithId<XyzData>) => Xyz;

export const buildMakeXyz: BuildMakeXyzFn =
  ({ Id, sanitizeText }) =>
  ({ _id = Id.makeId(), name }) => {
    const validateId = (text?: string) => {
      if (!text || !Id.isValidId(text)) {
        throw new ForwardToUserError('Xyz must have a valid id.');
      }
      return text;
    };
    const validateName = (text: string) => {
      if (!text) {
        throw new ForwardToUserError('Xyz must have a name.');
      }
      name = sanitizeText(text);
      if (name.length < 1) {
        throw new ForwardToUserError('Name contains no usable text.');
      }
      return name;
    };

    _id = validateId(_id);
    name = validateName(name);

    return {
      getId: () => _id,
      getName: () => name,
      setName: (newName: string) => {
        name = validateName(newName);
      },
      getData: () => ({
        _id,
        name,
      }),
    } as const;
  };
