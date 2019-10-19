import moment from 'moment';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { UserToken, User } from '../models';
import { DbUser, DbUserModel } from '../store/users';
import config, { KnownConfigKey } from './config';

export function initPassport() {
  //local strategy for login
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, callback) => {
      DbUser.findOne({ email: email, password: password }, { password: 0 })
        .exec(
          (err: any, user: DbUserModel) => {
            if (user) {
              user.lastLoginDate = moment().format('DD-MM-YYYY');
              user.save();
              const userToken: UserToken = {
                _id: user._id,
                username: user.username
              }
              const userForClient: User = {
                ...userToken,
                email: user.email,
                avatarUrl: user.avatarUrl,
                registrationDate: user.registrationDate,
                lastLoginDate: user.lastLoginDate
              }
              callback(null, { userForClient, userToken }, { message: 'succeeded' });
            }
            else callback(null, false, { message: 'failed' });
          },
        );
    },
  ));

  passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get(KnownConfigKey.JwtSecret),
    },
    // in this case the user credential is actually the same as jwtPayload
    // can consider simply passing jwtPayload, however it might be stale (common though)
    // trade-off: lightweight token vs. required info for most API's to reduce user re-query needs
    (jwtPayload: UserToken, callback) =>
      callback(null, jwtPayload),
  ));
}
