import { describe, it, expect } from 'vitest';
import { createDigitValidator, isValidGuess, evaluateGuess, generateSecret, countPossibleSecrets, } from './game.js';
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
describe('isValidGuess', () => {
    it('должен правильно валидировать попытки пользователя', () => {
        expect(isValidGuess('123', 3, 10)).toBe(true);
        expect(isValidGuess('12', 3, 10)).toBe(false);
        expect(isValidGuess('123', 4, 10)).toBe(false);
    });
    it('должен возвращать false, если есть недопустимые символы для base', () => {
        expect(isValidGuess('12', 2, 10)).toBe(true);
        expect(isValidGuess('12a', 3, 10)).toBe(false);
        expect(isValidGuess('12', 2, 2)).toBe(false);
    });
    it('должен возвращать false, если символы повторяются', () => {
        expect(isValidGuess('123', 3, 10)).toBe(true);
        expect(isValidGuess('112', 3, 10)).toBe(false);
        expect(isValidGuess('A2a', 3, 16)).toBe(false);
    });
});
describe('evaluateGuess', () => {
    it('должен вернуть все быки при полном совпадении чисел', () => {
        expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
    });
    it('должен правильно считать коров, если цифры перепутаны местами', () => {
        expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
    });
    it('должен корректно считать смешанные результаты и игнорировать регистр букв', () => {
        expect(evaluateGuess('aB34', 'Ab43')).toEqual({ bulls: 2, cows: 2 });
    });
});
describe('generateSecret', () => {
    it('должен генерировать строку правильной длины', () => {
        const result = generateSecret(4, 10);
        expect(result.length).toBe(4);
    });
    it('должен быть предсказуемым при передаче кастомного random', () => {
        const fakeRandom = () => 0.1;
        const result = generateSecret(3, 10, fakeRandom);
        expect(typeof result).toBe('string');
    });
});
describe('countPossibleSecrets', () => {
    it('должен правильно считать количество вариантов для длины 1', () => {
        expect(countPossibleSecrets(1, 10)).toBe(10);
    });
    it('должен правильно считать количество вариантов для длины 2', () => {
        expect(countPossibleSecrets(2, 10)).toBe(90);
    });
});
//# sourceMappingURL=game.test.js.map