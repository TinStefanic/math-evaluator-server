import express from 'express';
import { ensureExpressionIsPresent } from './api/ensureExpressionIsPresent';
import { evaluateExpression } from './api/evaluateExpression';

export interface IApiRequestQuery {
    expression?: string;
}

export interface IApiResponse {
    /** Result after evaluating expression. */
    result?: number;

    /** Description of error. */
    errorMessage?: string;

    /** Start position of error. */
    errorStartPos?: number;

    /** End position of error. */
    errorEndPos?: number;

    /** Start position of operator related to error. */
    errorOpStartPos?: number;

    /** End position of operator related to error. */
    errorOpEndPos?: number;
}

const apiRouter = express.Router();
apiRouter.get("/", [ensureExpressionIsPresent, evaluateExpression]);
export default apiRouter;