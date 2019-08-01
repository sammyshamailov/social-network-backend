import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';

export function nameValidation(req: Request, res: Response, next: NextFunction) {
    
    const product: Product = req.body;

    if((!product.name) || (product.name.length < 3)){
        next(new Error('name'));
    }
    next();
}

export function idValidation(req: Request, res: Response, next: NextFunction) {
    
    if (req.params.id.length < 36){
        next(new Error('id'));
    }
    next();
  }