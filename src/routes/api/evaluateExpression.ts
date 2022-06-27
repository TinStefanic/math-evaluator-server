import { NextFunction, Request, Response } from 'express';
import { EvaluatorError } from '../../services/evaluator/evaluatorErrors';
import { EvaluatorService } from '../../services/evaluatorService';
import { IApiRequestQuery, IApiResponse } from '../api';

export function evaluateExpression(
    req: Request<unknown, IApiResponse, unknown, IApiRequestQuery>, 
    res: Response<IApiResponse>, 
    next: NextFunction)
{
    const expression = req.query.expression ?? "";
    const evaluator = new EvaluatorService();

    try {
        const result = evaluator.eval(expression);
        res.status(200).json( {result: result} );

    } catch (error) {
        if (error instanceof EvaluatorError) {
            const e = error as EvaluatorError;
            res.status(422).json({
                errorMessage: e.message,
                errorStartPos: e.startPos,
                errorEndPos: e.endPos,
                errorOpStartPos: e.operatorStartPos,
                errorOpEndPos: e.operatorEndPos
            });
        } else {
            const e = error as Error;
            console.log(`Unexpected error ${e}`);

            res.status(500).send();
        }
    }

    next();
}