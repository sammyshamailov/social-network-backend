import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import mongoose from 'mongoose';

import { emailScehma, passwordSchema } from '../validations/common';
import { ErrorTypes } from './error';

/**
 * Password validation for registration.
 * @param req Request.
 * @param res Respone.
 * @param next NextFunction.
 * @returns 400 error if password format is invalid, otherwise passes handleling to
 * next middleware.
 */
function passwordValidation(req: Request, res: Response, next: NextFunction): void {
    const { error, value } = joi.validate(req.body.password, passwordSchema);
    if (error) {
        res.status(400).send(ErrorTypes.badPasswordFormat);
        return;
    }
    next();
}

/**
 * id validation for all requests demanding id (tweet or member).
 * @param req Request.
 * @param res Respone.
 * @param next NextFunction.
 * @returns 400 error if id format is invalid, otherwise passes handleling to
 * next middleware.
 */
function idValidation(req: Request, res: Response, next: NextFunction) {
    const answer = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!answer) {
        res.status(400).send(ErrorTypes.badIdFormat);
        return;
    }
    next();
}

/**
 * Email validation for registration.
 * @param req Request.
 * @param res Respone.
 * @param next NextFunction.
 * @returns 400 error if email format is invalid, otherwise passes handleling to
 * next middleware.
 */
function emailValidation(req: Request, res: Response, next: NextFunction) {
    const { error, value } = joi.validate(req.body.email, emailScehma);
    if(error) {
        res.status(400).send(ErrorTypes.badEmailFormat);
        return;
    }
    next();
}

export { passwordValidation, idValidation, emailValidation };