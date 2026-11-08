import { describe, it, expect } from 'vitest';
import { createDigitValidator } from './game';

describe('createDigitValidator', () => {
  it('должен валидировать двоичную систему (base 2)', () => {
    const isBinaryDigit = createDigitValidator(2);
    expect(isBinaryDigit('0')).toBe(true);
    expect(isBinaryDigit('1')).toBe(true);
    expect(isBinaryDigit('2')).toBe(false);
    expect(isBinaryDigit('a')).toBe(false);
  });

  it('должен валидировать десятичную систему (base 10)', () => {
    const isDecimalDigit = createDigitValidator(10);
    expect(isDecimalDigit('5')).toBe(true);
    expect(isDecimalDigit('9')).toBe(true);
    expect(isDecimalDigit('a')).toBe(false);
  });

  it('должен валидировать шестнадцатеричную систему (base 16) без учета регистра', () => {
    const isHexDigit = createDigitValidator(16);
    expect(isHexDigit('9')).toBe(true);
    expect(isHexDigit('a')).toBe(true);
    expect(isHexDigit('F')).toBe(true);
    expect(isHexDigit('g')).toBe(false);
  });
});
