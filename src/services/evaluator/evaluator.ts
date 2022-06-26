import { OperatorError } from './operators/operators';
import { Expression } from './expression';
import { Queue } from 'queue-typescript';
import { OperatorCollection } from './operators/operatorCollection';
import { EvaluatedParsedExpression, IParsedExpression, ParsedExpression } from './expressionParser/parsedExpression';
import { IParsedBinaryOperator } from "./expressionParser/parsedBinaryOperator";
import { EmptyParenthesesError, EvaluatorError } from './evaluatorErrors';
import { ExpressionParser } from './expressionParser/expressionParser';
import { EmptyExpressionError } from './expressionParser/expressionParsingErrors';

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
        
        /* If it isn't enclosed in brackets it is guaranteed to be just number. */
        return this.#expressionParser.parseIntExpression(parsedExpression);
    }

    #evaluateExpressionQueue(expressions: Queue<IParsedExpression>, operators: Queue<IParsedBinaryOperator>): number {
        this.#operatorCollection.operatorPriorities.forEach(
            (priority) => {
                [expressions, operators] = this.#applyAllOperatorsOfTargetPriority(priority, expressions, operators);
            }
        );

        return expressions.front.value(this);
    }

    #applyAllOperatorsOfTargetPriority(
        priority: number, 
        expressions: Queue<IParsedExpression>, 
        operators: Queue<IParsedBinaryOperator>
    ): [Queue<IParsedExpression>, Queue<IParsedBinaryOperator>] 
    {
        const newExpressions = new Queue<IParsedExpression>();
        const newOperators = new Queue<IParsedBinaryOperator>();

        while (operators.length > 0) {
            if (operators.front.priority !== priority) {
                newExpressions.enqueue(expressions.dequeue());
                newOperators.enqueue(operators.dequeue());
                continue;
            }

            const lhs = expressions.dequeue(), rhs = expressions.dequeue();
            const operator = operators.dequeue();

            expressions.prepend(this.#applyOperator(lhs, rhs, operator));
        }

        while (expressions.length > 0) newExpressions.enqueue(expressions.dequeue());

        return [newExpressions, newOperators];
    }

    #applyOperator(
        lhs: IParsedExpression, 
        rhs: IParsedExpression, 
        operator: IParsedBinaryOperator
        ): EvaluatedParsedExpression 
    {
        try {
            const value = operator.apply(lhs.value(this), rhs.value(this));
            const isEnclosedInBrackets = false;

            // NOTE: it uses only rhs as its start and end index, so that in case such as:
            //       '10 / 5 / 0' error message highlights '5 / 0', instead of entire '10 / 5 / 0'.
            const newExpression = new EvaluatedParsedExpression(
                rhs.originalStartIndex,
                rhs.originalEndIndex, 
                isEnclosedInBrackets, 
                value
            );

            return newExpression;

        } catch (error) {
            if (error instanceof OperatorError) {
                const e = error as OperatorError;
                e.startPos = lhs.originalStartIndex;
                e.endPos = rhs.originalEndIndex;
                e.operatorStartPos = operator.originalStartPosition;
                e.operatorEndPos = operator.originalEndPosition;

                throw e;
            }

            if (error instanceof EvaluatorError)
                throw error as EvaluatorError;

            throw error;
        }
    }
}