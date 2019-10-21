import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ErrorTypes } from '../middleware/error';
import { TweetText, TweetToSend, UserToken } from '../models';
import tweetsService from '../services/tweets.service';

/**
 * Sends user details to service if authenticated user requests tweets.
 * @param req Request.
 * @param res Response.
 * @param next NextFunction.
 * @returns all tweets.
 */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        let tweets: TweetToSend[];
        const userDetails: UserToken | undefined = getUserDetailsFromToken(req.headers.authorization);
        tweets = await tweetsService.getAll(userDetails);
        res.status(200).send(tweets);
    }
    catch (err) {
        next(new Error(err));
    }
}

/**
 * Sends tweet text and user details to service.
 * @param req Request.
 * @param res Response.
 * @param next NextFunction.
 * @returns new tweet or 400 error if bad input.
 */
export async function addTweet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const tweetText = req.body as TweetText;
        const userDetails: UserToken = {
            _id: res.locals._id,
            username: res.locals.username
        };
        const addedTweet = await tweetsService.addTweet(tweetText.text, userDetails);
        if (!addedTweet) {
            res.status(400).send(ErrorTypes.badInput);
            return;
        }
        else {
            res.status(201).send(addedTweet);
        }
    }
    catch (err) {
        next(new Error(err));
    }
}

/**
 * Sends tweet id for delete and user details to service.
 * @param req Request.
 * @param res Response.
 * @param next NextFunction.
 * @returns 404 if tweet doesn't exist,
 * 409 if requesting user isn't the owner.
 * 204 if tweet deleted successfully.
 */
export async function deleteTweet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const tweetId: string = req.params.id;
        const userDetails: UserToken = {
            _id: res.locals._id,
            username: res.locals.username
        };
        const isTweetRemoved = await tweetsService.deleteTweet(tweetId, userDetails);
        if (isTweetRemoved === ErrorTypes.tweetNotFound) {
            res.status(404).send(ErrorTypes.tweetNotFound);
            return;
        }
        else if (isTweetRemoved === ErrorTypes.notTheOwner) {
            res.status(409).send(ErrorTypes.notTheOwner);
            return;
        }
        else {
            res.sendStatus(204);
        }
    }
    catch (err) {
        next(new Error(err));
    }
}

/**
 * Sends tweet id for star-toggle and user details to service.
 * @param req Request.
 * @param res Response.
 * @param next NextFunction.
 * @returns 404 if tweet doesn't exist,
 * else updated star count and starredByMe state.
 */
export async function starTweet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const tweetId = req.params.id;
        const userDetails: UserToken = {
            _id: res.locals._id,
            username: res.locals.username
        };
        const tweetForClient = await tweetsService.starTweet(tweetId, userDetails);
        if (!tweetForClient) {
            res.status(404).send(ErrorTypes.tweetNotFound);
            return;
        }
        else {
            const stars = tweetForClient.stars;
            const starredByMe = tweetForClient.starredByMe;
            res.send({ stars, starredByMe });
        }
    }
    catch (err) {
        next(new Error(err));
    }
}

/**
 * Helper function for decoding user details from token.
 * @param [authorizationHeader] Authorization header containing token.
 * @returns user details from token.
 */
function getUserDetailsFromToken(authorizationHeader?: string): UserToken | undefined {
    if (authorizationHeader) {
        const tokenStartPlace: number = authorizationHeader.indexOf(' ') + 1;
        const tokenEndPlace: number = authorizationHeader.length - 1;
        return JSON.parse(JSON.stringify(jwt.decode(authorizationHeader.substring(tokenStartPlace, tokenEndPlace))));
    }
    return undefined;
}