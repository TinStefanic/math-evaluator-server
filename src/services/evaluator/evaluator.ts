import { IBinaryOperator, OperatorError } from './operators/operators';
import { Expression } from './expression';
import { Queue } from 'queue-typescript'
import { EvaluatorError } from "../evaluatorService";
import { OperatorCollection } from './operators/operatorCollection';
import { ParsedExpression, EvaluatedParsedExpression, IParsedExpression } from './expressionParser/parsedExpression';
import { IParsedBinaryOperator } from "./expressionParser/parsedBinaryOperator";

export class Evaluator {
    #operatorCollection: OperatorCollection;
    #expressionParser: ExpressionParser;

    constructor(operatorCollection: OperatorCollection) {
        this.#operatorCollection = operatorCollection;
        this.#expressionParser = new ExpressionParser(this.#operatorCollection.operatorSymbols);
    }

    eval(expression: Expression): number {
        const [expressions, operators] = this.#parseExpression(expression);

        if (expressions.length === 0) throw new EmptyExpressionError("Cannot evaluate empty expression.");

        if (expressions.length === 1) return this.#handleSingleExpression(expressions.front);

        return this.#evaluateExpressionQueue(expressions, operators);
    }

    #parseExpression(expression: Expression): [Queue<IParsedExpression>, Queue<IParsedBinaryOperator>] {
        return this.#expressionParser.parse(expression);
    }

    /** Doesn't work on arbitrary expression, expects expression returned from parseExpression. */
    #handleSingleExpression(expression: IParsedExpression): number {
        if (this.#expressionParser.isEnclosedInBrackets(expression)) {
            try {
                return this.eval(this.#expressionParser.removeEnclosedBrackets(expression));
            } catch (error) {
                if (error instanceof EmptyExpressionError) {
                    const e = error as EmptyExpressionError;

                    throw new EmptyParenthesesError(
                        e.message, 
                        expression.originalStartIndex, 
                        expression.originalEndIndex,
                    );
                }

                throw error;
            }
        }
        
        /* If it isn't enclosed in brackets it is guaranteed to be just number. */
        return this.#expressionParser.parseIntExpression(expression);
    }

    #evaluateExpressionQueue(expressions: Queue<IParsedExpression>, operators: Queue<IParsedBinaryOperator>): number {
        this.#operatorCollection.operatorPriorities.forEach(
            (priority) => {
                [expressions, operators] = this.#applyAllOperatorsOfTargetPriority(priority, expressions, operators);
            }
        );

        return this.#handleSingleExpression(expressions.front);
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
                throw new EvaluatorError(
                    e.message, 
                    lhs.originalStartIndex, 
                    rhs.originalEndIndex, 
                    operator.startPosition, 
                    operator.endPosition
                );
            }

            if (error instanceof EvaluatorError)
                throw error as EvaluatorError;

            throw error;
        }
    }
}

export class EmptyExpressionError extends EvaluatorError {
    constructor(message: string) {
        super(message);
    }
}

export class EmptyParenthesesError extends EvaluatorError {
    constructor(message: string, startPos: number, endPos: number) {
        super(message, startPos, endPos);
    }
}