export function createDigitValidator(base: number): (char: string) => boolean {
    const alphabet = '0123456789abcdef';
    const allowedSymbols = alphabet.slice(0, base);
    return (char: string) => {
        return allowedSymbols.includes(char.toLowerCase());
    };
}

export function isValidGuess(
    guess: string,
    length: number,
    base: number,
): boolean {
    const isValidDigit = createDigitValidator(base);
    return (
        guess.length === length &&
        guess.split('').every(isValidDigit) &&
        new Set(guess.toLowerCase()).size === guess.length
    );
}

export function evaluateGuess(
    secret: string,
    guess: string,
): { bulls: number; cows: number } {
    const s = secret.toLowerCase();
    const g = guess.toLowerCase();

    return g.split('').reduce(
        (acc, char, index) => {
            if (char === s[index]) {
                acc.bulls += 1;
            } else if (s.includes(char)) {
                acc.cows += 1;
            }

            return acc;
        },
        { bulls: 0, cows: 0 },
    );
}
