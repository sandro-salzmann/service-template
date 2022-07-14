import { Xyz, XyzData } from './xyz/xyz.type';

export interface Document {
  getId: () => string;
  getName: () => string;
  setName: (name: string) => void;
  getTeamId: () => string;
  getMyXyz: () => Xyz | null;
  getData: () => DocumentData;
}

export interface DocumentData {
  _id?: string;
  name: string;
  teamId: string;
  myXyzData: XyzData | null;
}
