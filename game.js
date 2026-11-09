const alphabet = '0123456789abcdef';
export function createDigitValidator(base) {
    const allowedSymbols = alphabet.slice(0, base);
    return (char) => {
        return allowedSymbols.includes(char.toLowerCase());
    };
}
export function isValidGuess(guess, length, base) {
    const isValidDigit = createDigitValidator(base);
    return (guess.length === length &&
        guess.split('').every(isValidDigit) &&
        new Set(guess.toLowerCase()).size === guess.length);
}
export function evaluateGuess(secret, guess) {
    const s = secret.toLowerCase();
    const g = guess.toLowerCase();
    return g.split('').reduce((acc, char, index) => {
        if (char === s[index]) {
            acc.bulls += 1;
        }
        else if (s.includes(char)) {
            acc.cows += 1;
        }
        return acc;
    }, { bulls: 0, cows: 0 });
}
export function generateSecret(length, base, random = Math.random) {
    const symbols = alphabet.slice(0, base).split('');
    symbols.sort(() => random() - 0.5);
    const resultSymbols = symbols.slice(0, length);
    return resultSymbols.join('');
}
const cache = {};
export function countPossibleSecrets(length, base) {
    if (length === 0)
        return 1;
    const key = `${length}-${base}`;
    if (cache[key] !== undefined) {
        return cache[key];
    }
    const result = base * countPossibleSecrets(length - 1, base - 1);
    cache[key] = result;
    return result;
}
//# sourceMappingURL=game.js.map