import { OperatorCollection } from '../../../../src/services/evaluator/operators/operatorCollection';
import { AdditionOperator, MultiplicationOperator, FloatDivisionOperator, SubtractionOperator } from '../../../../src/services/evaluator/operators/operators';

describe("OperatorCollection tests", () => {
    
    it("Should have array of only priority '1'", () => {
        const operatorCollection = new OperatorCollection([new AdditionOperator()]);

        expect(operatorCollection.operatorPriorities).toEqual([1]);
    });

    it("Shouldn't have duplicate priorities", () => {
        const operatorCollection = 
            new OperatorCollection([new MultiplicationOperator(), new FloatDivisionOperator()]);
        
        expect(operatorCollection.operatorPriorities).toEqual([2]);
    });

    it("Should have priorities sorted in descending order", () => {
        const operatorCollection = 
            new OperatorCollection([new SubtractionOperator(), new FloatDivisionOperator()]);
        
        expect(operatorCollection.operatorPriorities).toEqual([2, 1]);
    });
});