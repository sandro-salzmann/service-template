import { makeFakeAuthData } from '../__test__/fixtures/make-fake-auth-data';
import { checkAuthString } from './check-auth-string';

it('should not fail when auth is valid', () => {
  const authData = makeFakeAuthData();
  const auth = checkAuthString(JSON.stringify(authData));
  expect(auth.accountId).toBe(authData.accountId);
});

it('should fail when auth is invalid', () => {
  const nullAuth = null;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore to test null value
  expect(() => checkAuthString(nullAuth)).toThrow('Missing authorization.');
  const undefinedAuth = undefined;
  expect(() => checkAuthString(undefinedAuth)).toThrow('Missing authorization.');
  // invalid json object
  const invalidAuth = 'invalid';
  expect(() => checkAuthString(invalidAuth)).toThrow('Authorization is not valid JSON.');
});

it("should fail when auth's account id is invalid", () => {
  const nullAccountId = JSON.stringify(makeFakeAuthData({ accountId: null }));
  expect(() => checkAuthString(nullAccountId)).toThrow(new RegExp('^Authorization validation error: '));
  const invalidAccountId = JSON.stringify(makeFakeAuthData({ accountId: 'invalid' }));
  expect(() => checkAuthString(invalidAccountId)).toThrow(new RegExp('^Authorization validation error: '));
});
