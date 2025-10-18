import { CassMongo, CassMongoManager } from './main/cass-mongo';
import { config } from 'dotenv';

config();

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

const manager = new CassMongoManager();
const cassMongo = manager.getInstance({
  uri: process.env.MONGO_URI,
  collection: 'database',
});

let isInitialized = false;
async function initializeMongo() {
  if (!isInitialized) {
    await cassMongo.start();
    console.log('MongoDB initialized successfully');
    isInitialized = true;
  }
}

initializeMongo().catch((error) => {
  console.error('Failed to initialize MongoDB:', error);
  process.exit(1);
});

export { cassMongo, manager };