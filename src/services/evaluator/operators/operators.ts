import { EvaluatorError } from "../evaluatorErrors";

/** Interface that represents binary operator. */
export interface IBinaryOperator {
    /** Returns string representation of the operator. */
    asSymbol(): string;

    /** Applies the operator on 2 values. */
    apply(lhs: number, rhs: number): number;

    /** Priority of the operator, bigger number implies bigger priority. 
     *  For example multiplication should have higher priority than addition.*/
    get priority() : number;
        
}

export class AdditionOperator implements IBinaryOperator {
    asSymbol(): string {
        return "+";
    }

    apply(lhs: number, rhs: number): number {
        return lhs + rhs;
    }

    get priority(): number {
        return 1;
    }
}

export class SubtractionOperator implements IBinaryOperator {
    asSymbol(): string {
        return "-";
    }

    apply(lhs: number, rhs: number): number {
        return lhs - rhs;
    }

    get priority(): number {
        return 1;
    }
}

export class MultiplicationOperator implements IBinaryOperator {
    asSymbol(): string {
        return "*";
    }

    apply(lhs: number, rhs: number): number {
        return lhs * rhs;
    }

    get priority(): number {
        return 2;
    }
}

export class FloatDivisionOperator implements IBinaryOperator {
    asSymbol(): string {
        return "/";
    }

    apply(lhs: number, rhs: number): number {
        // Different part of the system ensures that arguments won't be NaNs.
        if (rhs === 0 || isNaN(rhs / lhs)) throw new DivisionByZeroError();

        return lhs / rhs;
    }

    get priority(): number {
        return 2;
    }
}

export class IntegerDivisionOperator implements IBinaryOperator {
    asSymbol(): string {
        return "/";
    }

    apply(lhs: number, rhs: number): number {
        if (rhs === 0) throw new DivisionByZeroError();

        // Works the following way:
        // Math.floor(-10 / 3) = -4;
        // Alternatively can use: 
        // Math.trunc(-10 / 3) = -3;
        return Math.floor(lhs / rhs);
    }

    get priority(): number {
        return 2;
    }
}

export class OperatorError extends EvaluatorError {
    constructor(message?: string) {
        super(message);
    }
}

export class DivisionByZeroError extends OperatorError {
    constructor() {
        super("Cannot divide by zero.")
    }
}
