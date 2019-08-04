import { Request, Response, NextFunction } from 'express';

export function inputError(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err.message === errorType.name){
        res.status(400).send('product name is less than 3 chars or null');;
        return;
    }
    else if(err.message === errorType.id){
        res.status(400).send('id is less than 36 chars');
        return;
    }
    next(err);
}

export function notFoundError(err: Error, req: Request, res: Response, next: NextFunction){
    if(err.message === errorType.notFound){
        res.status(404).send('there is no item with this id');
        return;
    }
    next(err);
}

enum errorType {name = 'name', id = "id", notFound = "not-found"};