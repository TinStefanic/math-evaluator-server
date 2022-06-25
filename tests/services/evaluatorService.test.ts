import { EvaluatorService, EvaluatorError } from '../../src/services/evaluatorService';

/*
    Here expression refers to group of tokens (string) that can be evaluated to have value.
    For example expression are: '5', '7 * 10', '(13 + 5) - 4'.
    
    Valid input is also expression, but it is exclusively referred to as input to make tests clearer.

    For example if input is '123 - 241 * (13 + 5)', then it is composed of 
    expressions: '123', '241', '(13 + 5)'; and operators: '-', '*'.
*/
describe("Evaluator service tests", () => {
    const evaluator = new EvaluatorService();

    describe("Forbidden characters in input", () => {
        const input = "13 + 5 - abc";

        it("Should throw correct error type", () => {
            expect(evaluator.eval(input)).toThrow(EvaluatorError);
        });

        it("Should throw correct error message", () => {
            expect(evaluator.eval(input)).toThrow(/Unrecognized character at .*/);
        });

        it("Should throw error with position of first forbidden character", () => {
            try {
                evaluator.eval(input);
                fail("Expected to throw error, but error wasn't thrown");
            } catch (error) {
                const e = error as EvaluatorError;
                expect(e.startPos).toEqual(9);
                expect(e.endPos).toEqual(10);
            }
        });
    });

    describe("Expression shouldn't be followed by an expression", () => {
        const input = "13 + 5 5";

        it("Should throw correct error type", () => {
            expect(evaluator.eval(input)).toThrow(EvaluatorError);
        });

        it("Should throw correct error message", () => {
            expect(evaluator.eval(input)).toThrow(/Expression shouldn't be followed by an expression.*/);
        });

        it("Should throw error with position where expression following another expression started", () => {
            try {
                evaluator.eval(input);
                fail("Expected to throw error, but error wasn't thrown");
            } catch (error) {
                const e = error as EvaluatorError;
                expect(e.startPos).toEqual(7);
                expect(e.endPos).toEqual(8);
            }
        });
    });

    describe("Operator should be followed by expression", () => {
        const input = "13 + 5 * -";

        it("Should throw correct error type", () => {
            expect(evaluator.eval(input)).toThrow(EvaluatorError);
        });

        it("Should throw correct error message", () => {
            expect(evaluator.eval(input)).toThrow(/Operator should be followed by an expression.*/);
        });

        it("Should throw error with position where expression was expected", () => {
            try {
                evaluator.eval(input);
                fail("Expected to throw error, but error wasn't thrown");
            } catch (error) {
                const e = error as EvaluatorError;
                expect(e.startPos).toEqual(9);
                expect(e.endPos).toEqual(10);
            }
        });

        it("Should throw error with position if there is no token after operator", () => {
            try {
                evaluator.eval("13 + 5 * ");
                fail("Expected to throw error, but error wasn't thrown");
            } catch (error) {
                const e = error as EvaluatorError;
                expect(e.startPos).toEqual(9);
                expect(e.endPos).toEqual(9);
            }
        });
    });

    describe.each([
        ["", 0, 0],
        [" + 8 - 5", 1, 2],
        ["  ", 2, 2]
    ])("Input should start with expression", (input: string, expectedStart: number, expectedEnd: number) => {
        it("Should throw correct error type", () => {
            expect(evaluator.eval(input)).toThrow(EvaluatorError);
        });

        it("Should throw correct error message", () => {
            expect(evaluator.eval(input)).toThrow(/Input expression should start with expression.*/);
        });

        it("Should throw error with position of first token not part of expression", () => {
            try {
                evaluator.eval(input);
                fail("Expected to throw error, but error wasn't thrown");
            } catch (error) {
                const e = error as EvaluatorError;
                expect(e.startPos).toEqual(expectedStart);
                expect(e.endPos).toEqual(expectedEnd);
            }
        });
    });

    describe("Testing valid inputs", () => {
        it.each([
            ["1", 1],
            ["2 + 3", 5],
            ["6 - 3", 3],
            ["6 * 3", 18],
            ["6 / 3", 2],
            ["(7)", 7],
            ["7 - 4 * 2", -1],
            ["(7 - 4) * 2", 6]
        ])("Should evaluate expression correctly", (input: string, expectedResult: number) => {
            expect(evaluator.eval(input)).toEqual(expectedResult);
        });
    });
});