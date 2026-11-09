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
