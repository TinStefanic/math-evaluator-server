import { Queue } from "queue-typescript";
import { EvaluatorError } from "./evaluatorErrors";
import { IParsedBinaryOperator } from "./expressionParser/parsedBinaryOperator";
import { EvaluatedParsedExpression, IParsedExpression } from "./expressionParser/parsedExpression";
import { OperatorError } from './operators/operators';
import { Evaluator } from './evaluator';

export function applyAllOperatorsOfTargetPriority(
    priority: number, 
    expressions: Queue<IParsedExpression>, 
    operators: Queue<IParsedBinaryOperator>,
    evaluator: Evaluator
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

        expressions.prepend(applyOperator(lhs, rhs, operator, evaluator));
    }

    while (expressions.length > 0) newExpressions.enqueue(expressions.dequeue());

    return [newExpressions, newOperators];
}

function applyOperator(
    lhs: IParsedExpression, 
    rhs: IParsedExpression, 
    operator: IParsedBinaryOperator,
    evaluator: Evaluator
    ): EvaluatedParsedExpression 
{
    try {
        const value = operator.apply(lhs.value(evaluator), rhs.value(evaluator));
        const isEnclosedInBrackets = false;

        // NOTE: it uses only rhs as its start and end index, so that in case such as:
        //       '10 / 5 / 0' error message highlights '5 / 0', instead of entire '10 / 5 / 0'.
        return new EvaluatedParsedExpression(
            rhs.originalStartIndex,
            rhs.originalEndIndex, 
            isEnclosedInBrackets, 
            value
        );

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