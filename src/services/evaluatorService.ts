import dotenv from 'dotenv';
import { Expression } from './evaluator/expression';
import { AdditionOperator, FloatDivisionOperator, IBinaryOperator, 
         IntegerDivisionOperator, MultiplicationOperator, SubtractionOperator 
        } from './evaluator/operators';
dotenv.config();

export class EvaluatorService {
    #operators: Map<string, IBinaryOperator>;

    constructor() {
        this.#operators = new Map<string, IBinaryOperator>();

        this.#addToOperators(new AdditionOperator());
        this.#addToOperators(new SubtractionOperator());
        this.#addToOperators(new MultiplicationOperator());

        if (process.env.USE_INTEGER_DIVISION === "true")
            this.#addToOperators(new IntegerDivisionOperator());
        else {
            this.#addToOperators(new FloatDivisionOperator());
        }
    }

    eval(expressionString: string): number {
        const expression = Expression.fromString(expressionString);
        const evaluator = new Evaluator(this.#operators);

        return evaluator.eval(expression);
    }

    #addToOperators(operator: IBinaryOperator) {
        const key = operator.toString();
        this.#operators.set(key, operator);
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