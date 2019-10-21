import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ErrorTypes } from '../middleware/error';
import { TweetToSend, User, UserToken } from '../models';
import membersService from '../services/members.service';

/**
 * Sends member id to service.
 * If member does not exist sends 404 error.
 * Else sends 200 with the user details.
 * @param req Request.
 * @param res Response.
 * @param next NextFunction.
 * @returns error or user details.
 */
export async function getMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const memberId: string = req.params.id
        const member: User | null = await membersService.getMember(memberId);
        if (!member) {
            res.status(404).send(ErrorTypes.noMember);
            return;
        }
        else {
            res.status(200).send(member);
        }
    }
    catch (err) {
        next(new Error(err));
    }
}

/**
 * Sends user id and user details decrypted from token for logged in user.
 * If member does not exist sends 404 error.
 * Else sends 200 with the user tweets.
 * @param req Request.
 * @param res Response.
 * @param next NextFunction.
 * @returns error member tweets 
 */
export async function getMemberTweets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const memberId: string = req.params.id
        const userDetails: UserToken | undefined = getUserDetailsFromToken(req.headers.authorization);
        const tweetsForClient: TweetToSend[] | null = await membersService.getMemberTweets(memberId, userDetails);
        if (!tweetsForClient) {
            res.status(404).send(ErrorTypes.noMember);
            return;
        }
        else {
            res.status(200).send(tweetsForClient);
        }
    }
    catch (err) {
        next(new Error(err));
    }
}

/**
 * Helper function for decoding user details from token
 * @param [authorizationHeader] Authorization header content.
 * @returns user details from token or undefined if there is no content in header.
 */
function getUserDetailsFromToken(authorizationHeader?: string): UserToken | undefined {
    if (authorizationHeader) {
        const tokenStartPlace: number = authorizationHeader.indexOf(' ') + 1;
        const tokenEndPlace: number = authorizationHeader.length - 1;
        return JSON.parse(JSON.stringify(jwt.decode(authorizationHeader.substring(tokenStartPlace, tokenEndPlace))));
    }
    return undefined;
}