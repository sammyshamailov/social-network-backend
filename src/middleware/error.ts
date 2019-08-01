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

// export function clientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
//   if (!req.xhr) {
//     res.status(500).send({ error: 'Something failed!' });
//   } else {
//     next(err);
//   }
// }

// export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
//   res.status(500);
//   res.render('error', { error: err });
// }
