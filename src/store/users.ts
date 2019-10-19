import mongoose from 'mongoose';
import { User } from '../models'

const schema = new mongoose.Schema(
  {
    email: String,
    username: String,
    password: String,
    avatarUrl: String,
    registrationDate: String,
    lastLoginDate: String
  },
  {
    versionKey: false
  },
);

export interface DbUserModel extends User, mongoose.Document {
  password: string;
  _id: string;
}

export const DbUser: mongoose.Model<DbUserModel> =
  mongoose.model<DbUserModel>('User', schema);
