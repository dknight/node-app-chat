const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    expect(isRealString(3213)).toBeFalsy();
    expect(isRealString([1,3,3])).toBeFalsy();
    expect(isRealString({name: "boo"})).toBeFalsy();
  });

  it('should reject strings with only spaces', () => {
    expect(isRealString(' ')).toBeFalsy();
    expect(isRealString('     ')).toBeFalsy();
  });

  it('should allows strings with non-spaces chars', () => {
    expect(isRealString('HelloDima')).toBeTruthy();
  });
});