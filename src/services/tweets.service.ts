import moment from 'moment';
import mongodb from 'mongodb';

import { ErrorTypes } from '../middleware/error';
import { TweetToSend, UserToken } from '../models';
import { DbTweet, DbTweetModel } from '../store/tweets';
import { DbUser } from '../store/users';

/**
 * Retrieves all tweets from server.
 * If authenticated user requests tweets, sets starredByMe state for each tweet.
 * @param [userDetails] authenticated user details from token.
 * @returns all tweets from old to new to controller.
 */
async function getAll(userDetails?: UserToken): Promise<TweetToSend[]> {
    try {
        const tweetsFromDb = await DbTweet.find().exec();
        let tweetsForClient: TweetToSend[] = [];
        for (let i = 0; i < tweetsFromDb.length; i++) {
            tweetsForClient[i] = transformToClientModel(tweetsFromDb[i])
        }
        // enter when logged in user requests all tweets
        if (userDetails) {
            for (let i = 0; i < tweetsFromDb.length; i++) {
                tweetsForClient[i].starredByMe = tweetsFromDb[i].userStars.find(userStar => userStar === userDetails.username) ? true : false;
            }
        }
        return tweetsForClient.reverse();
    }
    catch (err) {
        throw new Error(err);
    }
}

/**
 * Adds tweet to db if tweet text didn't exceed limit.
 * @param tweetText tweet content.
 * @param userDetails user details of user that posted.
 * @returns new tweet or null if tweet text exceeded limit.
 */
async function addTweet(tweetText: string, userDetails: UserToken): Promise<TweetToSend | null> {
    try {
        if (tweetText.length > 240 || tweetText.length <= 0) {
            return null;
        }
        const _id = new mongodb.ObjectID(userDetails._id);
        const user = await DbUser.findOne({ _id }).exec();
        const tweetForDb = {
            _id: new mongodb.ObjectID().toHexString(),
            text: tweetText,
            userId: userDetails._id,
            username: userDetails.username,
            postDate: moment().format('DD-MM-YYYY'),
            userStars: [String],
            avatarUrl: user? user.avatarUrl : ''
        };
        let tweetForClient = await DbTweet.create(tweetForDb);
        // array of strings in mongoose schemas generates array with one unnecessary index.
        tweetForClient.userStars.splice(0);
        tweetForClient.save();
        return transformToClientModel(tweetForClient);
    }
    catch (err) {
        throw new Error(err);
    }
}

/**
 * Sends delete request to the server.
 * @param tweetId tweet id for delete.
 * @param userDetails user details of requesting user.
 * @returns true if tweet delted successfully, else right error.
 */
async function deleteTweet(tweetId: string, userDetails: UserToken) {
    try {
        const _id = new mongodb.ObjectID(tweetId);
        const tweetToDelete = await DbTweet.findOne({ _id }).exec();
        if (tweetToDelete && tweetToDelete.userId !== userDetails._id) return ErrorTypes.notTheOwner;
        const deletedTweet = await DbTweet.deleteOne({ _id }).exec();
        if (!deletedTweet || !deletedTweet.ok || !deletedTweet.n) return ErrorTypes.tweetNotFound;
        return true;
    }
    catch (err) {
        throw new Error(err);
    }
}

/**
 * Sends star-toggle request to the server.
 * @param tweetId tweet id for star-toggle.
 * @param userDetails user details for adding/removing star from tweet.
 * @returns client tweet model.
 */
async function starTweet(tweetId: string, userDetails: UserToken): Promise<TweetToSend | null> {
    try {
        const _id = new mongodb.ObjectID(tweetId);
        const tweetFromDb = await DbTweet.findOne({ _id }).exec();
        let tweetForClient: TweetToSend;
        if (tweetFromDb) {
            tweetForClient = transformToClientModel(tweetFromDb);
            // set starredByMe state for each tweet.
            tweetForClient.starredByMe = tweetFromDb.userStars.find(userStar => userStar === userDetails.username) ? true : false;
            // enter if the tweet was already starred by the requesting user.
            if (tweetForClient.starredByMe) {
                tweetForClient.stars--;
                const userStarToDelete = tweetFromDb.userStars.findIndex(userStar => userStar === userDetails.username);
                tweetFromDb.userStars.splice(userStarToDelete, 1);
            }
            else {
                tweetForClient.stars++;
                tweetFromDb.userStars.push(userDetails.username);
            }
            tweetForClient.starredByMe = !tweetForClient.starredByMe;
            tweetFromDb.save();
            return tweetForClient;
        }
        return null;
    }
    catch (err) {
        throw new Error(err);
    }
}

/**
 * Helper function for creating client tweet model from db tweet model.
 * @param dbTweet db tweet model.
 * @returns client tweet model. 
 */
function transformToClientModel(dbTweet: DbTweetModel): TweetToSend {
    const tweet: TweetToSend = {
        _id: dbTweet._id,
        text: dbTweet.text,
        userId: dbTweet.userId,
        username: dbTweet.username,
        postDate: dbTweet.postDate,
        avatarUrl: dbTweet.avatarUrl,
        stars: dbTweet.userStars.length ? dbTweet.userStars.length : 0,
        starredByMe: false
    }
    return tweet;
}

export default {
    getAll,
    addTweet,
    deleteTweet,
    starTweet
};