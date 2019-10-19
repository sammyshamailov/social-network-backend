import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import { passwordSchema, emailScehma } from '../validations/common';
import mongoose from 'mongoose';
import { ErrorTypes } from './error';

function passwordValidation(req: Request, res: Response, next: NextFunction) {
    const { error, value } = joi.validate(req.body.password, passwordSchema);
    if (error) {
        res.status(400).send(ErrorTypes.badPasswordFormat);
        return;
    }
    next();
}

function idValidation(req: Request, res: Response, next: NextFunction) {
    const answer = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!answer) {
        res.status(400).send(ErrorTypes.badIdFormat);
        return;
    }
    next();
}

function emailValidation(req: Request, res: Response, next: NextFunction) {
    const { error, value } = joi.validate(req.body.email, emailScehma);
    if(error) {
        res.status(400).send(ErrorTypes.badEmailFormat);
        return;
    }
    next();
}

export { passwordValidation, idValidation, emailValidation };