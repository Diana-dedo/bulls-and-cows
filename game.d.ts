export declare function createDigitValidator(
    base: number,
): (char: string) => boolean;
export declare function isValidGuess(
    guess: string,
    length: number,
    base: number,
): boolean;
export declare function evaluateGuess(
    secret: string,
    guess: string,
): {
    bulls: number;
    cows: number;
};
export declare function generateSecret(
    length: number,
    base: number,
    random?: () => number,
): string;
export declare function countPossibleSecrets(
    length: number,
    base: number,
): number;
export interface HistoryEntry {
    guess: string;
    bulls: number;
    cows: number;
}
export interface GameState {
    length: number;
    base: number;
    secret: string;
    history: HistoryEntry[];
    isWon: boolean;
    startTime: number | null;
}
//# sourceMappingURL=game.d.ts.map
