import { flaschenpost } from 'flaschenpost';
import { Db, MongoClient } from 'mongodb';
import { makeDocumentDb } from './document-db';

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE, MONGO_HOST } = process.env;

const logger = flaschenpost.getLogger();

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/`;
const client = new MongoClient(url);

let db: Db;

export const initDb = async () => {
  await client.connect();
  db = client.db(MONGO_DATABASE);
  logger.info('Connected successfully to database.');
};

export const closeDb = async () => {
  await client.close();
};

export type MakeDbFn = () => Db;

const makeDb: MakeDbFn = () => db;

export const documentDb = makeDocumentDb({ makeDb });
