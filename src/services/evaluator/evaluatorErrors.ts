export class EvaluatorError extends Error {
    /** Starting position of problematic part of expression, inclusive. */
    startPos?: number;
    /** Ending position of problematic part of expression, exclusive. */
    endPos?: number;

    /** Starting position of problematic operator, inclusive. */
    operatorStartPos?: number;
    /** Ending position of problematic operator, exclusive. */
    operatorEndPos?: number;

    constructor(
        message?: string, 
        startPos?: number, 
        endPos?: number, 
        operatorStartPos?: number, 
        operatorEndPos?: number) 
    {
        super(message);
        this.startPos = startPos;
        this.endPos = endPos;
        this.operatorStartPos = operatorStartPos;
        this.operatorEndPos = operatorEndPos;
    }
}

export class EmptyParenthesesError extends EvaluatorError {
    constructor(startPos: number, endPos: number) {
        super("Cannot evaluate empty parentheses.", startPos, endPos);
    }
}

export class UnmatchedOpenParenthesesError extends EvaluatorError {
    constructor(startPos: number, endPos: number) {
        super("Following parenthesis doesn't have matching closing parenthesis", startPos, endPos);
    }
}

export class UnmatchedCloseParenthesesError extends EvaluatorError {
    constructor(startPos: number, endPos: number) {
        super("Following parenthesis doesn't have matching opening parenthesis", startPos, endPos);
    }
}