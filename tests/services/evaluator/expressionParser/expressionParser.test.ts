import { createOperatorCollection } from '../../../../src/services/evaluator/operators/operatorCollection';
import { ExpressionParser } from '../../../../src/services/evaluator/expressionParser/expressionParser';
import { Expression } from '../../../../src/services/evaluator/expression';

describe("ExpressionParser tests", () => {
    const useIntegerDivision = false;
    const operatorCollection = createOperatorCollection(useIntegerDivision);
    const expressionParser = new ExpressionParser(operatorCollection);
    
    it.each([
        ["1 + 2 + 3", 3],
        ["1*3-3", 3],
        ["1", 1],
        ["((1))", 1],
        ["1 + (2 + (3 + (4 + 5)))", 2],
        ["()", 1]
    ])("Should parse input into correct number of expressions: %s", 
        (inputString: string, expectedNumExpressions: number) => 
    {
        const [expressions, ] = expressionParser.parse(Expression.fromString(inputString));

        expect(expressions.length).toEqual(expectedNumExpressions);
    });

    it.each([
        ["1", false],
        ["(2)", true],
        ["(13 - 5) * (3 + 5)", true],
        ["5 + 8 + 3", false],
        ["  ( 7 - 8 + 3 ) ", true],
        ["4 * (7 + 8)", false]
    ])("Should detect if first sub-expression is or isn't enclosed in parenthesis: %s", 
        (inputString: string, expectedAnswer: boolean) => 
    {
        const [expressions, ] = expressionParser.parse(Expression.fromString(inputString));

        expect(expressions.front.isEnclosedInBrackets).toEqual(expectedAnswer);
    });

    it.each([
        ["1", 1],
        ["303", 303],
        ["8080", 8080]
    ])("Should parse parsedExpression into correct integer: %s", 
        (inputString: string, expectedNumber: number) => 
    {
        const [expressions, ] = expressionParser.parse(Expression.fromString(inputString));

        const parsedNumber = expressionParser.parseIntExpression(expressions.front);

        expect(parsedNumber).toEqual(expectedNumber);
    });

    it.each([
        [" 1", 1, 2],
        ["   5 ", 3, 4],
        ["  (7 - 8)   ", 2, 9]
    ])("Should trim whitespace from parsedExpressions fronts and ends: %s", 
        (inputString: string, expectedStart: number, expectedEnd: number) => 
    {
        const [expressions, ] = expressionParser.parse(Expression.fromString(inputString));

        expect(expressions.front.originalStartIndex).toEqual(expectedStart);
        expect(expressions.front.originalEndIndex).toEqual(expectedEnd);
    });
});