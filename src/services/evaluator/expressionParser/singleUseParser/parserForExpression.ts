import { ParserForWhitespace } from './parserForWhitespace';
import { Expression } from '../../expression';
import { ParsedExpression } from '../parsedExpression';
import { BinaryOperatorNotFollowedByExpressionError, EmptyExpressionError, ExpressionUnexpectedCharacterError } from '../expressionParsingErrors';
import { IParsedBinaryOperator } from '../parsedBinaryOperator';
import { ParserForParenthesis } from './parserForParenthesis';
import { ParserForDigits } from './parserForDigits';

export class ParserForExpression {
    #parserForWhitespace = new ParserForWhitespace();
    #parserForParenthesis = new ParserForParenthesis();
    #parserForDigits = new ParserForDigits();

    /** Throws exception if it can't parse expression. */
    parseExpression(
        currPos: number, 
        expression: Expression, 
        precedingOperator?: IParsedBinaryOperator
        ): [number, ParsedExpression]
    {
        currPos = this.#parserForWhitespace.skipWhitespace(currPos, expression);

        this.#handleIfEndOfExpression(currPos, expression, precedingOperator);

        return this.#parseNextExpressionToken(currPos, expression);
    }

    #handleIfEndOfExpression(currPos: number, expression: Expression, precedingOperator?: IParsedBinaryOperator) {
        const startOfExpression = precedingOperator == null;

        if (currPos >= expression.length) {
            if (startOfExpression) {
                throw new EmptyExpressionError(expression);
            } else {
                throw new BinaryOperatorNotFollowedByExpressionError(
                    expression,
                    currPos,
                    precedingOperator.originalStartPosition,
                    precedingOperator.originalEndPosition
                );
            }
        }
    }

    #parseNextExpressionToken(currPos: number, expression: Expression): [number, ParsedExpression] {
        const currChar = expression.charAt(currPos);
        const oldPoss = currPos;
        let isEnclosedInParenthesis: boolean;

        if (this.#parserForParenthesis.isOpenParenthesis(currChar)) {
            currPos = this.#parserForParenthesis.skipToMatchingClosingParenthesis(currPos, expression);
            isEnclosedInParenthesis = true;

        } else if (this.#parserForDigits.isDigit(currChar)) {
            currPos = this.#parserForDigits.skipToFirstNonDigitCharacter(currPos, expression);
            isEnclosedInParenthesis = false;

        } else {
            throw new ExpressionUnexpectedCharacterError(expression, currPos);
        }

        return [currPos, new ParsedExpression(expression.slice(oldPoss, currPos), isEnclosedInParenthesis)];
    }
}