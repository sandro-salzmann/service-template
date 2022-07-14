import { DocumentData } from '../document/document.type';
import { XyzData } from '../document/xyz/xyz.type';

export type SomeOtherCallHandler = (xyzData: XyzData) => Promise<DocumentData>;
type BuildSomeOtherCallHandlerFn = () => SomeOtherCallHandler;

export const buildSomeOtherCallHandler: BuildSomeOtherCallHandlerFn = () => async () => {
  return {} as DocumentData;
};
