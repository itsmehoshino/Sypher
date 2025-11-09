import { CassMongoManager } from '@sy-database/main/cass-mongo';

const manager = new CassMongoManager();

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/app';

export const GlobalDB = (collection: string) => {
  const db = manager.getInstance({
    uri: process.env.MONGO_URI || DEFAULT_URI,
    collection
  });

  db.start().catch(() => {});

  return db;
};