import { makeXyz } from '.';
import { makeFakeXyzData } from '../../__test__/fixtures/make-fake-xyz-data';

it('must have a valid id', () => {
  const nullId = makeFakeXyzData({ _id: null });
  expect(() => makeXyz(nullId)).toThrow('Xyz must have a valid id.');
  const invalidId = makeFakeXyzData({ _id: 'invalid' });
  expect(() => makeXyz(invalidId)).toThrow('Xyz must have a valid id.');
});

it('must have a name', () => {
  const nullName = makeFakeXyzData({ name: null });
  expect(() => makeXyz(nullName)).toThrow('Xyz must have a name.');
  const emptyName = makeFakeXyzData({ name: undefined });
  expect(() => makeXyz(emptyName)).toThrow('Xyz must have a name.');
});

it('must sanitize the name', () => {
  const htmlEmptyName = makeFakeXyzData({
    name: '<svg><g/onload=alert(2)//<p>',
  });
  expect(() => makeXyz(htmlEmptyName)).toThrow('Name contains no usable text.');
});
