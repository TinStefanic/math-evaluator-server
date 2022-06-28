import { Expression } from '../../expression';
import { OperatorUnexpectedCharacterError } from "../expressionParsingErrors";
import { ParserForWhitespace } from "./parserForWhitespace";
import { OperatorCollection } from '../../operators/operatorCollection';
import { IParsedBinaryOperator } from '../parsedBinaryOperator';
import { IBinaryOperator } from '../../operators/operators';

export class ParserForOperator {
    #parserForWhitespace = new ParserForWhitespace();
    #operatorCollection: OperatorCollection;

    constructor(operatorCollection: OperatorCollection) {
        this.#operatorCollection = operatorCollection;
    }

    tryParseOperator(currPos: number, expression: Expression): [number, IParsedBinaryOperator?] {
        currPos = this.#parserForWhitespace.skipWhitespace(currPos, expression);

        if (currPos >= expression.length)
            return [currPos, undefined];

        const maxSymbolLength = expression.length - currPos;

        return this.#identifyAndProcessNextSymbol(currPos, expression, maxSymbolLength);
    }

    #identifyAndProcessNextSymbol(
        currPos: number, 
        expression: Expression, 
        maxSymbolLength: number): [number, IParsedBinaryOperator] 
    {
        for (const symbol of this.#operatorCollection.operatorSymbols) {
            if (symbol.length > maxSymbolLength)
                continue;
                
            const charsToCompareWith = expression.slice(currPos, currPos + symbol.length).asString();

            if (symbol !== charsToCompareWith)
                continue;

            const operator = this.#operatorCollection.getOperatorFromSymbol(symbol);
            const parsedOperator = this.#createParsedOperator(currPos, expression, operator);
            currPos += symbol.length;

            return [currPos, parsedOperator];
        }

        // No operator fits.
        throw new OperatorUnexpectedCharacterError(expression, currPos);
    }

    /** Only to be used when operator is guaranteed not to be null or undefined. */
    #createParsedOperator(currPos: number, expression: Expression, operator?: IBinaryOperator): IParsedBinaryOperator {
        if (operator == null) throw Error("Operator is undefined.");

        else {
            const opLength = operator.asSymbol().length;
            const startPosition = expression.originalIndexAt(currPos) ?? 0

            return {
                priority: operator.priority,
                apply: operator.apply,
                originalStartPosition: startPosition,
                originalEndPosition: startPosition + opLength,
                asSymbol: operator.asSymbol
            }
        }
    }
}