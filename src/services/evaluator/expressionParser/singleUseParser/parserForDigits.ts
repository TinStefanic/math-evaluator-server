import { Expression } from "../../expression";

export class ParserForDigits {
    isDigit(char?: string): boolean {
        return /^[0-9]$/.test(char ?? "");
    }

    skipToFirstNonDigitCharacter(currPos: number, expression: Expression): number {
        while (currPos < expression.length && this.isDigit(expression.charAt(currPos))) {
            ++currPos;
        }

        return currPos
    }
}