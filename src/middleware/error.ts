import { Request, Response, NextFunction } from 'express';

function error(err: any, req: Request, res: Response, next: NextFunction) {
    res.status(500).send(ErrorTypes.serverError);
}

enum ErrorTypes {
  notTheOwner = 'Not the owner',
  tweetNotFound = 'Tweet not found',
  unauthorized = 'Unauthorized',
  badIdFormat = 'Bad id format',
  noMember = 'Member not found',
  emailExists = 'Email already exists',
  usernameExists = 'Username already exists',
  badPasswordFormat = 'Bad password format',
  invalidCred = 'Username or email incorrect',
  badEmailFormat = 'Bad email format',
  serverError = 'Something went wrong in server',
  badInput = 'Tweet text length isn\'t between 1 and 240'
};

export { error, ErrorTypes };


