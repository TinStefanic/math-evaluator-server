import { Evaluator } from './evaluator/evaluator';
import { Expression } from './evaluator/expression';
import { config } from '../configuration/config';
import { createOperatorCollection } from './evaluator/operators/operatorCollection';

/** Service that evaluates provided string expression using. */
export class EvaluatorService {
    #evaluator: Evaluator;

    constructor() {
        this.#evaluator = new Evaluator(createOperatorCollection(config.useIntegerDivision));
    }

    /**
     * Evaluates given expression, or throws error if unable to.
     * @param expressionString String to evaluate.
     * @returns Result of evaluation.
     * @throws {EvaluatorError} 
     *      Contains information about error, such as start and end position of problematic part,
     *      start and end position of operator where problem is, and message about error.
     */
    eval(expressionString: string): number {
        const expression = Expression.fromString(expressionString);

        return this.#evaluator.eval(expression);
    }
}