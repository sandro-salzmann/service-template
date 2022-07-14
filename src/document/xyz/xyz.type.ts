export interface Xyz {
  getId: () => string;
  getName: () => string;
  getData: () => XyzData;
}

export interface XyzData {
  _id: string;
  name: string;
}
