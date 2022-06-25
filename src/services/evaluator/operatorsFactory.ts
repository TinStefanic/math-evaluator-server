import { AdditionOperator, IBinaryOperator, MultiplicationOperator,
         SubtractionOperator, IntegerDivisionOperator, FloatDivisionOperator 
        } from './operators';

export function createOperatorsMap(useIntegerDivision: boolean): Map<string, IBinaryOperator> {
    const operators = new Map<string, IBinaryOperator>();

    operators.set(...toKeyValueTuple(new AdditionOperator()));
    operators.set(...toKeyValueTuple(new SubtractionOperator()));
    operators.set(...toKeyValueTuple(new MultiplicationOperator()));

    if (useIntegerDivision)
        operators.set(...toKeyValueTuple(new IntegerDivisionOperator()));
    else {
        operators.set(...toKeyValueTuple(new FloatDivisionOperator()));
    }

    return operators;
}

function toKeyValueTuple(operator: IBinaryOperator): [string, IBinaryOperator] {
    return [operator.toString(), operator];
}