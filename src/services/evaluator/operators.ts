
/** Interface that represents binary operator. */
export interface IBinaryOperator {
    /** Returns string representation of the operator. */
    toString(): string;

    /** Applies the operator on 2 values. */
    apply(lhs: number, rhs: number): number;

    /** Priority of the operator, bigger number implies bigger priority. 
     *  For example multiplication should have higher priority than addition.*/
    get priority() : number;
        
}

export class AdditionOperator implements IBinaryOperator {
    toString(): string {
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
    toString(): string {
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
    toString(): string {
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
    toString(): string {
        return "/";
    }

    apply(lhs: number, rhs: number): number {
        return lhs / rhs;
    }

    get priority(): number {
        return 2;
    }
}

export class IntegerDivisionOperator implements IBinaryOperator {
    toString(): string {
        return "/";
    }

    apply(lhs: number, rhs: number): number {
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
