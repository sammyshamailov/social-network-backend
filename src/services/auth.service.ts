import jwt from 'jsonwebtoken';
import moment from 'moment';
import mongodb from 'mongodb';

import { DbUser } from '../store/users';
import config, { KnownConfigKey } from '../utils/config';
import { User, UserToken } from '../models';
import { ErrorTypes } from '../middleware/error';


async function register(registrationDetails: any) {
    try {
        const isEmailExist = await DbUser.findOne({ email: registrationDetails.email }).exec();
        const isUsernameExist = await DbUser.findOne({ username: registrationDetails.username }).exec();
        if (isEmailExist) {
            return ErrorTypes.emailExists;
        }
        else if (isUsernameExist) {
            return ErrorTypes.usernameExists;
        }
        // Enter if username and email doesn't exist already.
        else {
            const jwtSecret = config.get(KnownConfigKey.JwtSecret);
            const userToken: UserToken = {
                _id: new mongodb.ObjectID().toHexString(),
                username: registrationDetails.username,
            };
            const userForClient: User = {
                ...userToken,
                email: registrationDetails.email,
                avatarUrl: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
                registrationDate: moment().format('DD-MM-YYYY'),
                lastLoginDate: moment().format('DD-MM-YYYY')
            };
            const userForDb = {
                ...userForClient,
                password: registrationDetails.password,
            };
            await DbUser.create(userForDb);

            const token = jwt.sign(userToken, jwtSecret);
            return { ...userForClient, token };
        }
    }
    catch (err) {
        throw new Error(err);
    }
}

export default {
    register
};