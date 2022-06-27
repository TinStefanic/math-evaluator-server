import { Queue } from 'queue-typescript';
import { Expression } from '../expression';
import { IParsedBinaryOperator } from './parsedBinaryOperator';
import { ParsedExpression } from './parsedExpression';
import { OperatorCollection } from '../operators/operatorCollection';
import { SingleUseParser } from './singleUseParser/singleUseParser';

export class ExpressionParser {
    #operatorCollection: OperatorCollection;

    constructor(operatorCollection: OperatorCollection) {
        this.#operatorCollection = operatorCollection;
    }

    /** Returned parsedExpressions will all start and end with non-whitespace character. */
    parse(expression: Expression): [Queue<ParsedExpression>, Queue<IParsedBinaryOperator>] {
        const parser = new SingleUseParser(this.#operatorCollection, expression);
        
        parser.parseExpression();

        while (!parser.isParsingFinished) {
            
            // If its end of input (i.e. no operator could be parsed) returns false.
            if (!parser.tryParseOperator()) return [parser.expressions, parser.operators];

            parser.parseExpression();
        }

        return [parser.expressions, parser.operators];
    }

    /** Returns copy of parsedExpression without the enclosing parenthesis. 
     *  Doesn't modify original parsedExpression. */
    removeEnclosedParenthesis(parsedExpression: ParsedExpression): Expression {
        const expression = parsedExpression.expression;
        return expression.slice(1, expression.length - 1);
    }

    /** Returns number corresponding to provided expression,
     *  expects parsedExpression to consist only of digits. */
    parseIntExpression(parsedExpression: ParsedExpression): number {
        return parseInt(parsedExpression.expression.asString());
    }
}