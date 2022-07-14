import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const useInMemoryDb = () => {
  let connection: MongoClient;
  let mongoServer: MongoMemoryServer;
  let db: Db;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    connection = await MongoClient.connect(mongoServer.getUri(), {});
    if (mongoServer.instanceInfo) {
      db = connection.db(mongoServer.instanceInfo.dbName);
    } else {
      throw new Error('Failed to start in-memory mongo server.');
    }
  });

  afterAll(async () => {
    if (connection) {
      await connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  return { makeDb: () => db };
};
