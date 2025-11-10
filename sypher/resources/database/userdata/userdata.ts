import { GlobalDB } from '@sy-database/globalDB';

class UserInfo {
  private cache: ReturnType<typeof GlobalDB>;
  private api: any;

  constructor({ api, collection = 'userInfo' }) {
    this.api = api;
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
      if (key in allData) {
        return allData[key];
      }

      const info = await this.api.getUserInfo(key);
      const { [key]: userInfo } = info;

      if (!userInfo) return null;

      allData[key] = { ...userInfo };
      await this.saveFile(allData);
      return allData[key];
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async set(key: string, newValue: Record<string, any>) {
    try {
      const allData = await this.loadFile();
      const keyValue = allData[key] || {};
      const updated = { ...allData, [key]: { ...keyValue, ...newValue } };
      return await this.saveFile(updated);
    } catch (err) {
      console.log(err);
      return await this.loadFile();
    }
  }

  async getAll() {
    try {
      return await this.loadFile();
    } catch (err) {
      console.log(err);
      return {};
    }
  }
}

export default UserInfo;