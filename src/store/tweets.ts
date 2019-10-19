import mongoose from 'mongoose';
import { Tweet } from '../models/tweet';

const tweetSchema = new mongoose.Schema(
  {
    text: String,
    userId: String,
    username: String,
    postDate: String,
    userStars: [String],
    avatarUrl: String
  },
  {
    versionKey: false,
  }
);

export interface DbTweetModel extends Tweet, mongoose.Document {
  userStars: [String];
  _id: string;
}

export const DbTweet: mongoose.Model<DbTweetModel> =
  mongoose.model<DbTweetModel>('Tweet', tweetSchema);