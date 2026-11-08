export function createDigitValidator(base: number): (char: string) => boolean {
  const alphabet = '0123456789abcdef';
  const allowedSymbols = alphabet.slice(0, base);
  return (char: string) => {
    return allowedSymbols.includes(char.toLowerCase());
  };
}
