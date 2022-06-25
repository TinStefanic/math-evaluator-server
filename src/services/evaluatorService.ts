import { Evaluator } from './evaluator/evaluator';
import { Expression } from './evaluator/expression';
import { config } from '../configuration/config';
import { createOperatorsMap } from './evaluator/operatorsFactory';
import { IBinaryOperator } from './evaluator/operators';

export class EvaluatorService {
    #operators: Map<string, IBinaryOperator>;
    #evaluator: Evaluator;

    constructor() {
        this.#operators = createOperatorsMap(config.useIntegerDivision);
        this.#evaluator = new Evaluator(this.#operators);
    }

    eval(expressionString: string): number {
        const expression = Expression.fromString(expressionString);

        return this.#evaluator.eval(expression).result;
    }
}

export class EvaluatorError extends Error {
    startPos?: number;
    endPos?: number;

    constructor(message?: string, startPos?: number, endPos?: number) {
        super(message);
        this.startPos = startPos;
        this.endPos = endPos;
    }
}