import { Expression } from '../../expression';

export class ParserForWhitespace {
    isWhitespace(char?: string) {
        return /^\s$/.test(char ?? "");
    }

    skipWhitespace(currPos: number, expression: Expression) {
        while (currPos < expression.length && this.isWhitespace(expression.charAt(currPos))) {
            ++currPos;
        }

        return currPos;
    }
}