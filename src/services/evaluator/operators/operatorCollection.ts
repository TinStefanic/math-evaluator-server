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

    #operatorSymbols: Array<string>;
     /** Contains all string representations of operators in collection, sorted by longest operator first. */
    get operatorSymbols(): Array<string> {
        return this.#operatorSymbols;
    }

    constructor(operatorArray: Array<IBinaryOperator>) {
        this.#operatorsMap = new Map<string, IBinaryOperator>();

        operatorArray.forEach((op) => {this.#operatorsMap.set(op.asSymbol(), op)});

        this.#operatorPriorities = this.#createOperatorPriorities(this.#operatorsMap);

        // Sorts operator symbols by descending length,
        // this is to make sure it tries to match longer symbols first.
        this.#operatorSymbols = Array.from(this.#operatorsMap.keys()).sort(
            (a, b) => a.length === b.length ? (a < b ? 1 : -1) : b.length - a.length
        );
    }

    /** Returns operator whose symbol matches given string, 
     *  or undefined if no operator in collection has provided symbol. */
    getOperatorFromSymbol(key: string): IBinaryOperator | undefined {
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