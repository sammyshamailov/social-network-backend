import jwt from 'jsonwebtoken';
import moment from 'moment';
import mongodb from 'mongodb';
import fs from 'fs';

import { DbUser } from '../store/users';
import config, { KnownConfigKey } from '../utils/config';
import { User, UserToken, UserDetails } from '../models';
import { ErrorTypes } from '../middleware/error';


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
            const userFiles = './src/static/';
            const staticBaseUrl = 'http://localhost:3000/static/';
            if (registrationDetails.file) {
                const file = registrationDetails.file
                const base64data = file.content.replace(/^data:.*,/, '');
                fs.writeFileSync(userFiles + file.name, base64data, 'base64');
            }
            const jwtSecret = config.get(KnownConfigKey.JwtSecret);
            const userToken: UserToken = {
                _id: new mongodb.ObjectID().toHexString(),
                username: registrationDetails.username,
            };
            const userForClient: User = {
                ...userToken,
                email: registrationDetails.email,
                avatarUrl: registrationDetails.file ? staticBaseUrl + registrationDetails.file.name : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
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