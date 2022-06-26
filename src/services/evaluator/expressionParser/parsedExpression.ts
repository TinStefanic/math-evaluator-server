import { Evaluator } from '../evaluator';
import { Expression } from '../expression';

/** Contains basic information about parsed expression. */
export interface IParsedExpression {
    get originalStartIndex(): number;
    /** End index is exclusive. */
    get originalEndIndex(): number;
    get isEnclosedInBrackets(): boolean;
    
    /** Returns value of the expression evaluated by evaluator. */
    value(evaluator: Evaluator): number;
}

/** To be returned by ExpressionParser, contain only necessary information about parsed expression. */
export class ParsedExpression implements IParsedExpression {
    #expression: Expression;
    get expression() {
        return this.#expression;
    }

    get originalStartIndex(): number {
        return this.#expression.originalIndexAt(0) ?? -10;
    }

    get originalEndIndex(): number {
        return this.#expression.originalIndexAtEnd();
    }

    #isEnclosedInBrackets: boolean;
    get isEnclosedInBrackets(): boolean {
       return this.#isEnclosedInBrackets; 
    }

    constructor(expression: Expression, isEnclosedInBrackets: boolean) {
        this.#expression = expression;
        this.#isEnclosedInBrackets = isEnclosedInBrackets;
    } 

    value(evaluator: Evaluator): number {
        return evaluator.eval(this.#expression);
    }
}

/** Represents already evaluated parsed expression. */
export class EvaluatedParsedExpression implements IParsedExpression {
    #originalStartIndex: number;
    get originalStartIndex(): number {
        return this.#originalStartIndex;
    }

    #originalEndIndex: number;
    get originalEndIndex(): number {
        return this.#originalEndIndex;
    }

    #isEnclosedInBrackets: boolean;
    get isEnclosedInBrackets(): boolean {
        return this.#isEnclosedInBrackets;
    }

    #value: number;

    constructor(startIndex: number, endIndex: number, isEnclosed: boolean, value: number) {
        this.#originalStartIndex = startIndex;
        this.#originalEndIndex = endIndex;
        this.#isEnclosedInBrackets = isEnclosed;
        this.#value = value;
    }

    /** Returns previously evaluated value, doesn't reevaluate. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value(evaluator: Evaluator): number {
        return this.#value;
    }
}