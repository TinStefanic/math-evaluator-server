import { NextFunction, Request, Response } from 'express';
import { keyof } from "ts-keyof";
import { IApiRequestQuery, IApiResponse } from '../api';

export function ensureExpressionIsPresent(
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