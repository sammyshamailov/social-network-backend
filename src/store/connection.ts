import mongoose from 'mongoose';
import config, { KnownConfigKey } from '../utils/config';
import { MongoConnection } from '../utils/mongo-connection';

const url = config.get(KnownConfigKey.DbServer);
const connection = new MongoConnection(url);

mongoose.set('useCreateIndex', true);

async function connectDb(): Promise<void> {
  await connection.connect();
}

async function closeDb(): Promise<void> {
  await connection.close();
}

export {
  connectDb,
  closeDb,
};
