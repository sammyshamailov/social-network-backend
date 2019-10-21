import mongodb from 'mongodb';

import { TweetToSend, User, UserToken } from '../models';
import { DbTweet, DbTweetModel } from '../store/tweets';
import { DbUser, DbUserModel } from '../store/users';

/**
 * Retrieves requested member from server.
 * @param memberId requested member id.
 * @returns error if member doesn't exist, otherwise member.
 */
export async function getMember(memberId: string): Promise<User | null> {
  try {
    const _id = new mongodb.ObjectId(memberId);
    const memberFromDb = await DbUser.findOne({ _id }, { password: 0 });
    if (memberFromDb) { return transformToClientUserModel(memberFromDb); }
    return null
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Retrieves requested member tweets from server.
 * @param memberId requested member id for his tweets.
 * @param [userDetails] user details decrypted from token
 * if authenticated user requested tweets.
 * @returns member tweets or null if member doesn't exist.
 */
export async function getMemberTweets(memberId: string, userDetails?: UserToken): Promise<TweetToSend[] | null> {
  try {
    const _id = new mongodb.ObjectId(memberId);
    const memberFromDb = await DbUser.findOne({ _id }, { password: 0 });
    if (memberFromDb) {
      const tweetsFromDb = await DbTweet.find({ userId: _id }).exec();
      let tweetsForClient: TweetToSend[] = [];
      for (let i = 0; i < tweetsFromDb.length; i++) {
        tweetsForClient[i] = transformToClientTweetModel(tweetsFromDb[i])
      }
      // enter when logged in user requests all tweets
      if (userDetails) {
        for (let i = 0; i < tweetsFromDb.length; i++) {
          tweetsForClient[i].starredByMe = tweetsFromDb[i].userStars.find(userStar => userStar === userDetails.username) ? true : false;
        }
      }
      return tweetsForClient.reverse();
    }
    return null
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Helper function for creating client user model from db user model.
 * @param dbUser db user model.
 * @returns client user model.
 */
function transformToClientUserModel(dbUser: DbUserModel): User {
  const user: User = {
    email: dbUser.email,
    _id: dbUser._id,
    username: dbUser.username,
    avatarUrl: dbUser.avatarUrl,
    registrationDate: dbUser.registrationDate,
    lastLoginDate: dbUser.lastLoginDate
  }
  return user;
}

/**
 * Helper function for creating client tweet model from db tweet model.
 * @param dbTweet db tweet model.
 * @returns client tweet model. 
 */
function transformToClientTweetModel(dbTweet: DbTweetModel): TweetToSend {
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
  getMember,
  getMemberTweets
};