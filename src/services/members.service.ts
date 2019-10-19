import mongodb from 'mongodb';

import { TweetToSend, User, UserToken } from '../models';
import { DbTweet, DbTweetModel } from '../store/tweets';
import { DbUser, DbUserModel } from '../store/users';

export async function getMember(memberId: string): Promise<User | null> {
  try {
    const _id = new mongodb.ObjectId(memberId);
    const memberFromDb = await DbUser.findOne({ _id }, { password: 0 });
    if (memberFromDb) return transformToClientUserModel(memberFromDb);
    return null
  }
  catch (err) {
    throw new Error(err);
  }
}

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