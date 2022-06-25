import { Expression } from "../../../src/services/evaluator/expression";

describe("Expression tests", () => {
    it.each([
        ["4 + 3 - 5", 4, "3"],
        ["4 + 3 - 5", 6, "-"],
        ["4 + 3 - 5", 1, " "]
    ])("Should be correct character", (expressionString: string, pos: number, expectedChar: string) => {
        const expression = Expression.fromString(expressionString);

        expect(expression.charAt(pos)).toEqual(expectedChar);
    });

    it.each([
        ["4 + 3 - 5", 4],
        ["4 + 3 - 5", 6],
        ["4 + 3 - 5", 1]
    ])("Should be correct original index", (expressionString: string, pos: number) => {
        const expression = Expression.fromString(expressionString);

        expect(expression.originalIndexAt(pos)).toEqual(pos);
    });

    it.each([
        ["2 - 4 + 3 - 5 * 9", 4, 12, 4, "3"],
        ["2 - 4 + 3 - 5 * 9", 4, 12, 6, "-"],
        ["2 - 4 + 3 - 5 * 9", 4, 12, 1, " "]
    ])("Should have correct char in slice", 
        (expressionString: string, start: number, end: number, pos: number, expectedChar: string) => 
    {
        const initialExpression = Expression.fromString(expressionString);

        const slicedExpression = initialExpression.slice(start, end);

        expect(slicedExpression.charAt(pos)).toEqual(expectedChar);
    });

    it.each([
        ["2 - 4 + 3 - 5 * 9", 4, 12, 4, 8],
        ["2 - 4 + 3 - 5 * 9", 4, 12, 6, 10],
        ["2 - 4 + 3 - 5 * 9", 4, 12, 1, 5]
    ])("Should have correct original index in slice", 
        (expressionString: string, start: number, end: number, pos: number, expectedOriginalIndex: number) => 
    {
        const initialExpression = Expression.fromString(expressionString);

        const slicedExpression = initialExpression.slice(start, end);

        expect(slicedExpression.originalIndexAt(pos)).toEqual(expectedOriginalIndex);
    });
});