import { Queue } from 'queue-typescript';
import { Expression } from '../expression';
import { IParsedBinaryOperator } from './parsedBinaryOperator';
import { ParsedExpression } from './parsedExpression';
import { OperatorCollection } from '../operators/operatorCollection';
import { UnmatchedOpenParenthesesError } from '../evaluatorErrors';
import { BinaryOperatorNotFollowedByExpressionError, EmptyExpressionError, ExpressionUnexpectedCharacterError, OperatorUnexpectedCharacterError } from './expressionParsingErrors';

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

class SingleUseParser {
    #operatorCollection: OperatorCollection;
    #expression: Expression;
    
    #expressions = new Queue<ParsedExpression>();
    get expressions() { return this.#expressions; }

    #operators = new Queue<IParsedBinaryOperator>();
    get operators() { return this.#operators; }

    #currPos = 0;

    get isParsingFinished() {
        return this.#currPos >= this.#expression.length; 
    }

    constructor(operatorCollection: OperatorCollection, expression: Expression) {
        this.#operatorCollection = operatorCollection;
        this.#expression = expression;
    }

    /** Throws exception if it can't parse expression. */
    parseExpression() {
        const startOfExpression = this.#expressions.length === 0;

        this.#skipWhitespace();

        if (this.#currPos >= this.#expression.length) {
            if (startOfExpression) {
                throw new EmptyExpressionError(this.#expression);
            }

            throw new BinaryOperatorNotFollowedByExpressionError(
                this.#expression,
                this.#currPos,
                this.#operators.tail.originalStartPosition,
                this.#operators.tail.originalEndPosition
            );
        }

        const currChar = this.#expression.charAt(this.#currPos);

        if (currChar === "(") {
            const oldPoss = this.#currPos;
            this.#skipToMatchingClosingParenthesis();
            const isEnclosedInParenthesis = true;
            this.#expressions.enqueue(
                new ParsedExpression(this.#expression.slice(oldPoss, this.#currPos), isEnclosedInParenthesis)
            );
        } else if (this.#isDigit(currChar)) {
            const oldPoss = this.#currPos;
            this.#skipToFirstNonDigitCharacter();
            const isEnclosedInParenthesis = false;
            this.#expressions.enqueue(
                new ParsedExpression(this.#expression.slice(oldPoss, this.#currPos), isEnclosedInParenthesis)
            );
        } else {
            throw new ExpressionUnexpectedCharacterError(this.#expression, this.#currPos);
        }
    }

    tryParseOperator(): boolean {
        this.#skipWhitespace();

        if (this.#currPos >= this.#expression.length) return false;

        const lenTillEnd = this.#expression.length - this.#currPos;

        for (const symbol of this.#operatorCollection.operatorSymbols) {
            if (symbol.length > lenTillEnd) continue;
            const charsToCompareWith = this.#expression.slice(this.#currPos, this.#currPos + symbol.length).asString();

            if (symbol !== charsToCompareWith) continue;

            const operator = this.#operatorCollection.getOperatorFromSymbol(symbol);

            this.#operators.enqueue({
                priority: operator?.priority ?? 0,
                apply: operator?.apply ?? ((a, b) => a+b),
                originalStartPosition: this.#expression.originalIndexAt(this.#currPos) ?? 0,
                originalEndPosition: this.#expression.originalIndexAt(this.#currPos + symbol.length) ?? 1,
                toString: operator?.toString ?? (() => "")
            });

            this.#currPos += symbol.length;
            return true;
        }

        throw new OperatorUnexpectedCharacterError(this.#expression, this.#currPos);
    }

    #isWhitespace(char?: string) {
        return /^\s$/.test(char ?? "");
    }

    #skipWhitespace() {
        while (this.#currPos < this.#expression.length && this.#isWhitespace(this.#expression.charAt(this.#currPos))) {
            ++this.#currPos;
        }
    }

    #skipToMatchingClosingParenthesis() {
        let numUnpairedParenthesis = 1;
        const startPos = this.#currPos++;

        while (this.#currPos < this.#expression.length) {
            if (this.#expression.charAt(this.#currPos) === ")") --numUnpairedParenthesis;
            if (this.#expression.charAt(this.#currPos) === "(") ++numUnpairedParenthesis;

            ++this.#currPos;
            if (numUnpairedParenthesis === 0) return;
        }

        throw new UnmatchedOpenParenthesesError(
            this.#expression.originalIndexAt(startPos) ?? 0,
            (this.#expression.originalIndexAt(startPos) ?? 0) + 1
        );
    }

    #isDigit(char?: string): boolean {
        return /^[0-9]$/.test(char ?? "");
    }

    #skipToFirstNonDigitCharacter() {
        while (this.#currPos < this.#expression.length && this.#isDigit(this.#expression.charAt(this.#currPos))) {
            ++this.#currPos;
        }
    }
}