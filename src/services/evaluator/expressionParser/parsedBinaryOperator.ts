import { IBinaryOperator } from '../operators/operators';

/** Extended IBinaryOperator that also contains information about start and end position of the operator. */
export interface IParsedBinaryOperator extends IBinaryOperator {
    originalStartPosition: number;
    originalEndPosition: number;
}