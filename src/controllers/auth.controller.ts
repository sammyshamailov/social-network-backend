import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';

import { ErrorTypes } from '../middleware/error';
import authService from '../services/auth.service';
import config, { KnownConfigKey } from '../utils/config';

const jwtSecret = config.get(KnownConfigKey.JwtSecret);

export async function register(req: Request, res: Response, next: NextFunction) {
    // TODO ADD AVATAR LOGIC WHEN DONE
    try {
        const registrationDetails = req.body;
        const addedUser = await authService.register(registrationDetails);
        // enter if email or username already exists.
        if (addedUser === ErrorTypes.emailExists || addedUser === ErrorTypes.usernameExists) {
            res.status(409).send(addedUser);
            return;
        }
        else {
            res.status(201).send(addedUser);
        }
    }
    catch (err) {
        next(new Error(err));
    }
}

export function login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', { session: false }, (err: Error, userToSendAndToken, info: IVerifyOptions) => {
        if (err || !userToSendAndToken) {
            return res.status(400).send(ErrorTypes.invalidCred);
        }

        req.login(userToSendAndToken.userToken, { session: false }, (error) => {
            if (error) {
                res.send(error);
            }
            const token = jwt.sign(userToSendAndToken.userToken, jwtSecret);
            return res.send({ ...userToSendAndToken.userForClient, token });
        });
    })(req, res);
}