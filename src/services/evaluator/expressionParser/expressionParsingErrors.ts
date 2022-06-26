import { EvaluatorError } from "../evaluatorErrors";
import { Expression } from "../expression";

export class EmptyExpressionError extends EvaluatorError {
    constructor(expression: Expression) {
        super(
            "Expected expression to parse, but found nothing.", 
            expression.originalIndexAt(0), 
            expression.originalIndexAtEnd()
        );
    }
}

export class BinaryOperatorNotFollowedByExpressionError extends EvaluatorError {
    constructor(expression: Expression, problemPos: number, opStartPos: number, opEndPos: number) {
        super(
            "Expected expression after operator, but input ended.", 
            opStartPos, 
            (expression.originalIndexAt(problemPos) ?? opEndPos) + 1,
            opStartPos,
            opEndPos
        );
    }
}

export class ExpressionUnexpectedCharacterError extends EvaluatorError {
    constructor(expression: Expression, problemPos: number) {
        super(
            "Expected '(' or number, but instead got '" + expression.charAt(problemPos) + "'.", 
            expression.originalIndexAt(problemPos), 
            (expression.originalIndexAt(problemPos) ?? 0) + 1
        );
    }
}

export class OperatorUnexpectedCharacterError extends EvaluatorError {
    constructor(expression: Expression, problemPos: number) {
        const errorMessage = 
            "Expected character/s corresponding to an operator, but instead got '" + 
            expression.charAt(problemPos) + "'.";

        super(
            errorMessage, 
            expression.originalIndexAt(problemPos), 
            (expression.originalIndexAt(problemPos) ?? 0) + 1
        );
    }
}