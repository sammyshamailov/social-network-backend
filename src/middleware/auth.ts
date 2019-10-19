import passport from 'passport';
import { UserToken } from '../models';
import { Request, Response, NextFunction } from 'express';

export function authenticate(callback?: (...args: any[]) => any) {
  return passport.authenticate('jwt', {session: false}, callback);
}

export function auth() { // authenticates and authorizes
  return (req: Request, res: Response, next: NextFunction) => {
    authenticate((err: Error, user: UserToken) => {
      if (err || !user) {
        res.sendStatus(401);
        return;
      }

      req.login(user, {session: false}, (error) => {
        if (error) {
          next(error);
          return;
        }
        if (!req.isAuthenticated()) {
          res.sendStatus(401);
          return;
        }
        // User details for next middleware
        res.locals._id = user._id;
        res.locals.username = user.username;
        next();
      });
    })(req, res);
  };
}