import express, { NextFunction, Request, Response } from 'express';
import { keyof } from 'ts-keyof';
import { EvaluatorError } from '../services/evaluator/evaluatorErrors';
import { EvaluatorService } from '../services/evaluatorService';

interface IApiRequestQuery {
    expression?: string;
}

interface IApiResponse {
    /** Result after evaluating expression. */
    result?: number;

    /** Description of error. */
    errorMessage?: string;

    /** Start position of error. */
    errorStartPos?: number;

    /** End position of error. */
    errorEndPos?: number;
}

const ensureExpressionIsPresent = function (
    req: Request<unknown, IApiResponse, unknown, IApiRequestQuery>, 
    res: Response<IApiResponse>, 
    next: NextFunction)
{
    const expression = "";
    if (req.query.expression == null) {
        res.status(400).json( 
            { errorMessage: `GET parameter '${keyof({expression})}' is mandatory but wasn't provided.`} 
        );
    }

    next();
}

const evaluateExpression = function (
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
                errorEndPos: e.endPos
            });
        }
    }

    next();
}

const apiRouter = express.Router();
apiRouter.get("/", [ensureExpressionIsPresent, evaluateExpression]);
export default apiRouter;