import { Request, Response, NextFunction } from 'express';

export function inputError(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err.message === 'name'){
        res.status(400).send('product name is less than 3 chars or null');;
        return;
    }
    else if(err.message === 'id'){
        res.status(400).send('id is less than 36 chars');
        return;
    }
    next(err);
}