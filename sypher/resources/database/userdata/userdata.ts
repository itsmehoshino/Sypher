import { GlobalDB } from '@sy-database/globalDB';

class UserInfo {
  private cache: ReturnType<typeof GlobalDB>;
  private api: any;

  constructor({ api, collection = 'userInfoCache' }) {
    this.api = api;
    this.cache = GlobalDB(collection);
  }

  private async loadCache() {
    return this.cache.load();
  }

  private async saveCache(data: Record<string, any>) {
    await this.cache.bulkPut(data);
    return this.loadCache();
  }

  async get(userId: string) {
    try {
      const allData = await this.loadCache();
      if (allData[userId]) {
        return allData[userId];
      }

      const info = await this.api.getUserInfo(userId);
      const userInfo = info[userId] || info;

      const newEntry = {
        [userId]: {
          ...userInfo,
          lastFetched: Date.now(),
        },
      };

      await this.saveCache({ ...allData, ...newEntry });
      return newEntry[userId];
    } catch (err) {
      console.error('UserInfo.get error:', err);
      return null;
    }
  }

  async set(userId: string, updates: Record<string, any>) {
    try {
      const allData = await this.loadCache();
      const current = allData[userId] || {};

      const updated = {
        [userId]: {
          ...current,
          ...updates,
          lastUpdated: Date.now(),
        },
      };

      return await this.saveCache({ ...allData, ...updated });
    } catch (err) {
      console.error('UserInfo.set error:', err);
      return this.loadCache();
    }
  }

  async getAll() {
    try {
      return await this.loadCache();
    } catch (err) {
      console.error('UserInfo.getAll error:', err);
      return {};
    }
  }

  async clear() {
    await this.cache.clear();
  }

  async remove(userId: string) {
    await this.cache.remove(userId);
  }
}

export default UserInfo;