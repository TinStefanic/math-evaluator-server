import { Queue } from 'queue-typescript';
import { Expression } from '../../expression';
import { IParsedBinaryOperator } from '../parsedBinaryOperator';
import { ParsedExpression } from '../parsedExpression';
import { OperatorCollection } from '../../operators/operatorCollection';
import { ParserForExpression } from './parserForExpression';
import { ParserForOperator } from './parserForOperator';

export class SingleUseParser {
    #operatorCollection: OperatorCollection;
    #expression: Expression;
    #currPos = 0;
    #parserForExpression = new ParserForExpression();
    #parserForOperator: ParserForOperator;

    #expressions = new Queue<ParsedExpression>();
    get expressions() { return this.#expressions; }

    #operators = new Queue<IParsedBinaryOperator>();
    get operators() { return this.#operators; }

    get isParsingFinished() {
        return this.#currPos >= this.#expression.length;
    }

    constructor(operatorCollection: OperatorCollection, expression: Expression) {
        this.#operatorCollection = operatorCollection;
        this.#expression = expression;
        this.#parserForOperator = new ParserForOperator(operatorCollection);
    }

    /** Throws exception if it can't parse expression. */
    parseExpression() {
        const [newCurrPos, parsedExpression] = 
            this.#parserForExpression.parseExpression(this.#currPos, this.#expression, this.#operators.tail);

        this.#currPos = newCurrPos;
        this.#expressions.enqueue(parsedExpression);
    }

    tryParseOperator(): boolean {
        const [newPos, parsedOperator] = this.#parserForOperator.tryParseOperator(this.#currPos, this.#expression);

        if (parsedOperator == null) return false;

        this.#currPos = newPos;
        this.#operators.enqueue(parsedOperator);

        return true;
    }
}
