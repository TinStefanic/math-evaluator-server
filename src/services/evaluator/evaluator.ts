import { Expression } from './expression';
import { Queue } from 'queue-typescript';
import { OperatorCollection } from './operators/operatorCollection';
import { IParsedExpression, ParsedExpression } from './expressionParser/parsedExpression';
import { IParsedBinaryOperator } from "./expressionParser/parsedBinaryOperator";
import { EmptyParenthesesError } from './evaluatorErrors';
import { ExpressionParser } from './expressionParser/expressionParser';
import { EmptyExpressionError } from './expressionParser/expressionParsingErrors';
import { applyAllOperatorsOfTargetPriority } from './expressionQueueEvaluator';

export class Evaluator {
    #operatorCollection: OperatorCollection;
    #expressionParser: ExpressionParser;

    constructor(operatorCollection: OperatorCollection) {
        this.#operatorCollection = operatorCollection;
        this.#expressionParser = new ExpressionParser(this.#operatorCollection);
    }

    eval(expression: Expression): number {
        const [expressions, operators] = this.#parseExpression(expression);

        if (expressions.length === 1) return this.#handleSingleExpression(expressions.front);

        return this.#evaluateExpressionQueue(expressions, operators);
    }

    #parseExpression(expression: Expression): [Queue<ParsedExpression>, Queue<IParsedBinaryOperator>] {
        return this.#expressionParser.parse(expression);
    }

    /** Doesn't work on arbitrary expression, expects expression returned from parseExpression. */
    #handleSingleExpression(parsedExpression: ParsedExpression): number {
        if (parsedExpression.isEnclosedInBrackets) {
            try {
                return this.eval(this.#expressionParser.removeEnclosedParenthesis(parsedExpression));
            } catch (error) {
                if (error instanceof EmptyExpressionError) {
                    throw new EmptyParenthesesError( 
                        parsedExpression.originalStartIndex, 
                        parsedExpression.originalEndIndex,
                    );
                }

                throw error;
            }
        }
        
        // If it isn't enclosed in brackets it is guaranteed to be just number.
        return this.#expressionParser.parseIntExpression(parsedExpression);
    }

    #evaluateExpressionQueue(expressions: Queue<IParsedExpression>, operators: Queue<IParsedBinaryOperator>): number {
        this.#operatorCollection.operatorPriorities.forEach(
            (priority) => {
                [expressions, operators] = applyAllOperatorsOfTargetPriority(priority, expressions, operators, this);
            }
        );

        return expressions.front.value(this);
    }
}