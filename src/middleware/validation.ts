import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';
import joi from 'joi';
import {productNameSchema, idSchema} from '../validations/joiSchemas'

export function nameValidation(req: Request, res: Response, next: NextFunction) {
    
    const product: Product = req.body;
    const {error, value: v} = joi.validate(product, productNameSchema);
    if (error) throw new Error('name');
    // if((!product.name) || (product.name.length < 3)){
    //     next(new Error('name'));
    // }
    next();
}

export function idValidation(req: Request, res: Response, next: NextFunction) {
    
    const {error, value: v} = joi.validate(req.params.id, idSchema);
    if (error) throw new Error('id');
    // if (req.params.id.length < 36){
    //     next(new Error('id'));
    // }
    next();
  }