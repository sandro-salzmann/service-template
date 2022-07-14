import { XyzData } from '../document/xyz/xyz.type';

export type SomeEventHandler = (xyzData: XyzData) => Promise<void>;
type BuildSomeEventHandlerFn = () => SomeEventHandler;

export const buildSomeEventHandler: BuildSomeEventHandlerFn = () => async () => {
  // do something
};
