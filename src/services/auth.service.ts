import jwt from 'jsonwebtoken';
import moment from 'moment';
import mongodb from 'mongodb';
import fs from 'fs';

import { DbUser } from '../store/users';
import config, { KnownConfigKey } from '../utils/config';
import { User, UserToken, UserDetails } from '../models';
import { ErrorTypes } from '../middleware/error';

/**
 * Checking if username or email already exist.
 * If username or email already exist sends right error to controller.
 * Else writes the avatar photo, creates needed interfaces
 * and writes info to server.
 * @param registrationDetails user details for registration.
 * @returns user details and token or error.
 */
async function register(registrationDetails: UserDetails) {
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
            // code block for avatar file writing.
            const userFiles = './src/static/';
            const staticBaseUrl = 'http://localhost:3000/static/';
            const file = registrationDetails.file
            const base64data = file.content.replace(/^data:.*,/, '');
            fs.writeFileSync(userFiles + file.name, base64data, 'base64');

            const jwtSecret = config.get(KnownConfigKey.JwtSecret);
            
            const userToken: UserToken = {
                _id: new mongodb.ObjectID().toHexString(),
                username: registrationDetails.username,
            };
            const userForClient: User = {
                ...userToken,
                email: registrationDetails.email,
                avatarUrl: staticBaseUrl + file.name,
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