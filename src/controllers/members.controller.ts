import { Request, Response, NextFunction } from 'express';
import membersService from '../services/members.service';
import { User, TweetToSend, UserToken } from '../models';
import { ErrorTypes } from '../middleware/error';
import jwt from 'jsonwebtoken';

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

function getUserDetailsFromToken(authorizationHeader?: string): UserToken | undefined {
    if (authorizationHeader) {
        const tokenStartPlace: number = authorizationHeader.indexOf(' ') + 1;
        const tokenEndPlace: number = authorizationHeader.length - 1;
        return JSON.parse(JSON.stringify(jwt.decode(authorizationHeader.substring(tokenStartPlace, tokenEndPlace))));
    }
    return undefined;
}