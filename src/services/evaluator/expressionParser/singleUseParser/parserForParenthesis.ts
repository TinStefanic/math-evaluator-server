import { UnmatchedOpenParenthesesError } from '../../evaluatorErrors';
import { Expression } from '../../expression';

export class ParserForParenthesis {
    isOpenParenthesis(currChar?: string) {
        return currChar === "(";
    }

    skipToMatchingClosingParenthesis(currPos: number, expression: Expression): number {
        let numUnpairedParenthesis = 1;
        const startPos = currPos++;

        while (currPos < expression.length) {
            if (expression.charAt(currPos) === ")")
                --numUnpairedParenthesis;
            if (expression.charAt(currPos) === "(")
                ++numUnpairedParenthesis;

            ++currPos;
            if (numUnpairedParenthesis === 0)
                return currPos;
        }

        throw new UnmatchedOpenParenthesesError(
            expression.originalIndexAt(startPos) ?? 0,
            (expression.originalIndexAt(startPos) ?? 0) + 1
        );
    }
}