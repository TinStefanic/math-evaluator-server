import { AdditionOperator, IBinaryOperator, MultiplicationOperator,
         SubtractionOperator, IntegerDivisionOperator, FloatDivisionOperator 
        } from './operators';

export class OperatorCollection {
    #operatorsMap: Map<string, IBinaryOperator>;

    #operatorPriorities: Array<number>;
    /** Array of all unique priorities of operators in collection, sorted from highest priority to lowest. */
    get operatorPriorities(): Array<number> {
        return this.#operatorPriorities;
    }

    /** Contains all string representations of operators in collection. */
    get operatorSymbols(): IterableIterator<string> {
        return this.#operatorsMap.keys();
    }

    constructor(operatorArray: Array<IBinaryOperator>) {
        this.#operatorsMap = new Map<string, IBinaryOperator>();

        operatorArray.forEach((op) => {this.#operatorsMap.set(op.toString(), op)});

        this.#operatorPriorities = this.#createOperatorPriorities(this.#operatorsMap);
    }

    /** Returns operator whose symbol matches given string, 
     *  or undefined if no operator in collection has provided symbol. */
    getOperatorFromString(key: string): IBinaryOperator | undefined {
        return this.#operatorsMap.get(key);
    }

    #createOperatorPriorities(operatorsMap: Map<string, IBinaryOperator>) : Array<number> {
        const prioritiesSet = new Set<number>();

        operatorsMap.forEach((value) => prioritiesSet.add(value.priority));

        const descendingOrder = (lhs: number, rhs: number) => { return rhs - lhs; };

        return Array.from<number>(prioritiesSet.values()).sort(descendingOrder);
    }
}

export function createOperatorCollection(useIntegerDivision: boolean): OperatorCollection {
    const operatorArray = Array.of<IBinaryOperator>(
        new AdditionOperator(), 
        new SubtractionOperator, 
        new MultiplicationOperator(),
        useIntegerDivision ? new IntegerDivisionOperator() : new FloatDivisionOperator()
    );

    return new OperatorCollection(operatorArray);
}