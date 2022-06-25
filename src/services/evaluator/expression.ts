export class Expression {
    #chars = new Array<string>();
    #originalIndex = new Array<number>();

    static fromString(expressionString: string): Expression {
        const expression = new Expression();

        expression.#chars = Array.from(expressionString);
        expression.#originalIndex = expression.#chars.map((_, i) => i);

        return expression;
    }

    charAt(pos: number): string | undefined {
        return this.#chars.at(pos);
    }

    /* Used so that sub-expression could know index of chars in the original expression string. 
       Intended use is for throwing parsing error's with information about where character was in original string.*/
    originalIndexAt(pos: number): number | undefined {
        return this.#originalIndex.at(pos);
    }

    slice(start?: number, end?: number): Expression{
        const expression = new Expression();

        expression.#chars = this.#chars.slice(start, end);
        expression.#originalIndex = this.#originalIndex.slice(start, end);

        return expression;
    }
}