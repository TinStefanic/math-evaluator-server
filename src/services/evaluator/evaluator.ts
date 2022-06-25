import { IBinaryOperator } from "./operators";
import { Expression } from './expression';
import { Queue } from 'queue-typescript'

export class Evaluator {
    #operatorsMap: Map<string, IBinaryOperator>;

    /** Sorted in descending order. */
    #operatorPriorities: Array<number>;

    constructor(operatorsMap: Map<string, IBinaryOperator>) {
        this.#operatorsMap = operatorsMap;

        this.#operatorPriorities = this.#createOperatorPriorities(operatorsMap);
    }

    eval(expression: Expression): EvaluatedExpression {
        const [expressions, operators] = this.#parseExpression(expression);

        
    }

    #createOperatorPriorities(operatorsMap: Map<string, IBinaryOperator>) : Array<number> {
        const prioritiesSet = new Set<number>();

        operatorsMap.forEach((value) => prioritiesSet.add(value.priority));

        const descendingSort = (lhs: number, rhs: number) => { return rhs - lhs; };

        return Array<number>.from(prioritiesSet.values()).sort(descendingSort);
    }
}

interface EvaluatedExpression {
    /** Result of the evaluation of expression. */
    result: number;

    /** Is the expression encapsulated by parenthesis'. */
    encapsulated: boolean;

    /** Expression that was evaluated. */
    expression: Expression;
}