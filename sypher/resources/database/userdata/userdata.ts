import { GlobalDB } from '@sy-database/globalDB';

class UserInfo {
  private cache: ReturnType<typeof GlobalDB>;

  constructor({ collection = 'userInfo' } = {}) {
    this.cache = GlobalDB(collection);
  }

  private async loadFile() {
    return await this.cache.load();
  }

  private async saveFile(data: Record<string, any>) {
    const current = await this.loadFile();
    const finalData = { ...current, ...data };
    await this.cache.bulkPut(finalData);
    return finalData;
  }

  async get(key: string) {
    try {
      const allData = await this.loadFile();
      return key in allData ? allData[key] : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async set(key: string, newValue: Record<string, any>) {
    try {
      const allData = await this.loadFile();
      const existing = allData[key] || {};
      const updated = { ...allData, [key]: { ...existing, ...newValue } };
      return await this.saveFile(updated);
    } catch (err) {
      console.error(err);
      return await this.loadFile();
    }
  }

  async getAll() {
    try {
      return await this.loadFile();
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  async clear() {
    await this.cache.bulkPut({});
  }

  async delete(key: string) {
    const allData = await this.loadFile();
    if (key in allData) {
      delete allData[key];
      await this.saveFile(allData);
    }
  }
}

export default UserInfo;
