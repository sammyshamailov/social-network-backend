import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';

export function nameValidation(req: Request, res: Response, next: NextFunction) {
    
    const product: Product = req.body;

    if((!product.name) || (product.name.length < 3)){
        res.status(409).send('product name is less than 3 chars or null');;
        return;
    }
    next();
}

export function idValidation(req: Request, res: Response, next: NextFunction) {
    if (req.params.id.length < 36){
        res.sendStatus(404);
        return;
    }
    next();
  }