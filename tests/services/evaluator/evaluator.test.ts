import { Evaluator, EmptyExpressionError } from '../../../src/services/evaluator/evaluator';
import { createOperatorCollection } from '../../../src/services/evaluator/operators/operatorCollection';
import { Expression } from '../../../src/services/evaluator/expression';
import { DivisionByZeroError } from '../../../src/services/evaluator/operators/operators';
import { EvaluatorError } from '../../../src/services/evaluatorService';
describe("Evaluator tests", () => {
    const useIntegerDivision = false;
    const evaluator = new Evaluator(createOperatorCollection(useIntegerDivision));

    it.each([
        ["8 + 5 - 2 * 2", 9],
        [" 8- 3+1", 6],
        ["3 / 3 * 3", 3],
        ["5", 5],
        ["(7 - 4) * 2", 6],
        ["7 - 4 * 2", -1],
        ["7 - (4 * 2)", -1],
        ["(((7)))", 7],
        ["(((2))-(((3))))", -1]
    ])("Should correctly evaluate", (inputString: string, expectedResult: number) => {
        const expression = Expression.fromString(inputString);

        expect(evaluator.eval(expression)).toEqual(expectedResult);
    });

    it.each([
        [""],
        ["    "],
    ])("Should throw empty expression error", (inputString: string) => {
        const expression = Expression.fromString(inputString);

        expect(evaluator.eval(expression)).toThrow(EmptyExpressionError);
    });

    describe.each([
        ["()", 0, 2],
        ["5 * ( )", 4, 7],
        ["3*(4-())+(9)", 5, 7]
    ]), "Empty parentheses error handling tests", (
        inputString: string, 
        expectedStart: number, 
        expectedEnd: number) => 
    {
        const expression = Expression.fromString(inputString);

        it("Should throw empty parentheses error", () => {
            expect(evaluator.eval(expression)).toThrow(EmptyParenthesesError);
        });

        it("Should have correct position of problematic parenthesis in the error", () => {
            try {
                evaluator.eval(expression);
                fail("Expected to throw error, but error wasn't thrown");
            } catch (error) {
                const e = error as EvaluatorError;
                expect(e.startPos).toEqual(expectedStart);
                expect(e.endPos).toEqual(expectedEnd);
            }
        });
    });

    describe.each([
        ["4 / 0", 0, 5, 2, 3],
        ["5 / (4 - 4)", 0, 11, 2, 3],
        ["(8 - 3 + 3) / (1 + 2 - 3)", 0, 25, 12, 13],
        ["5 - 6 + (8 - 3) / (4 - 2 * 2)", 8, 29, 16, 17],
        ["100 / (1 / 1000000 / 1000000 / 1000000)", 0, 39, 4, 5],
        ["10 / 5 / 0", 5, 10, 7, 8]
    ])("Division by zero error handling tests", (
        inputString: string, 
        expectedStart: number, 
        expectedEnd: number, 
        expectedOperatorStart: number, 
        expectedOperatorEnd: number) => 
    {
        const expression = Expression.fromString(inputString);

        it("Should throw division by zero error", () => {
            expect(evaluator.eval(expression)).toThrow(DivisionByZeroError);
        });

        it("Should have correct position of problematic expression in thrown error", () => {
            try {
                evaluator.eval(expression);
                fail("Expected to throw error, but error wasn't thrown");
            } catch (error) {
                const e = error as EvaluatorError;
                expect(e.startPos).toEqual(expectedStart);
                expect(e.endPos).toEqual(expectedEnd);
            }
        });

        it("Should have correct position of problematic operator in thrown error", () => {
            try {
                evaluator.eval(expression);
                fail("Expected to throw error, but error wasn't thrown");
            } catch (error) {
                const e = error as EvaluatorError;
                expect(e.operatorStartPos).toEqual(expectedOperatorStart);
                expect(e.operatorEndPos).toEqual(expectedOperatorEnd);
            }
        });
    });
});