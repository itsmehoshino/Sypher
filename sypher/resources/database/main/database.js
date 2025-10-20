const LiaMongo = require("lia-mongo");
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

class UserStatsManager {
  /**
   * @type {string | undefined}
   */
  #uri;
  /**
   * @type {string}
   */
  #collection;

  constructor({ uri = process.env.MONGO_URI, collection = 'database' } = {}) {
    this.defaults = {
      balance: 0,
      diamonds: 0,
      username: null,
    };
    this.mongo = null;
    this.#uri = uri ?? process.env.MONGO_URI;
    this.#collection = collection;
    this.isJsonMode = false;
    this.jsonFilePath = path.join(__dirname, `userStats_${this.#collection}.json`);

    if (!this.#uri) {
      console.warn(`No MongoDB URI provided, falling back to JSON mode for collection ${this.#collection}`);
      this.isJsonMode = true;
      this.cache = this.loadJsonDataSync();
    } else {
      this.mongo = new LiaMongo({
        uri: this.#uri,
        collection: this.#collection,
      });
      this.cache = {};
    }
  }

  loadJsonDataSync() {
    try {
      if (fs.existsSync(this.jsonFilePath)) {
        const data = fs.readFileSync(this.jsonFilePath, 'utf8');
        return JSON.parse(data) || {};
      }
      return {};
    } catch (error) {
      console.error(`Error loading JSON data for collection ${this.#collection}:`, error);
      return {};
    }
  }

  async saveJsonData(data) {
    try {
      await fsPromises.writeFile(this.jsonFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error saving JSON data for collection ${this.#collection}:`, error);
    }
  }

  updateCache(key, value) {
    this.cache[key] = value;
    if (this.isJsonMode) {
      this.saveJsonData(this.cache);
    }
  }

  process(data) {
    data = data || {};
    data.balance = typeof data.balance === "number" ? data.balance : 0;
    if (data.balance > Number.MAX_SAFE_INTEGER) {
      data.balance = Number.MAX_SAFE_INTEGER;
    }
    if (data.username) {
      data.username = data.username.trim();
    }
    return data;
  }

  async connect() {
    if (this.isJsonMode) {
      return;
    }
    try {
      await this.mongo.start();
      await this.mongo.put("test", this.defaults);
    } catch (error) {
      console.error(`MONGODB Error for collection ${this.#collection}:`, error);
      throw error;
    }
  }

  async getCache(key) {
    if (!this.cache[key]) {
      await this.get(key);
    }
    return JSON.parse(JSON.stringify(this.cache[key]));
  }

  async get(key) {
    if (!key || typeof key !== 'string') throw new Error('Invalid key');
    let data;
    if (this.isJsonMode) {
      data = this.process(this.cache[key] || {
        ...this.defaults,
        lastModified: Date.now(),
      });
    } else {
      data = this.process(
        (await this.mongo.get(key)) || {
          ...this.defaults,
          lastModified: Date.now(),
        }
      );
    }
    this.updateCache(key, data);
    return data;
  }

  async deleteUser(key) {
    if (!key || typeof key !== 'string') throw new Error('Invalid key');
    if (this.isJsonMode) {
      delete this.cache[key];
      await this.saveJsonData(this.cache);
      return this.getAll();
    }
    await this.mongo.remove(key);
    delete this.cache[key];
    return this.getAll();
  }

  async remove(key, removedProperties = []) {
    if (!key || typeof key !== 'string') throw new Error('Invalid key');
    if (!Array.isArray(removedProperties)) throw new Error('removedProperties must be an array');
    const user = await this.get(key);
    for (const item of removedProperties) {
      delete user[item];
    }
    if (this.isJsonMode) {
      this.updateCache(key, user);
      return this.getAll();
    }
    await this.mongo.put(key, user);
    this.updateCache(key, user);
    return this.getAll();
  }

  async set(key, updatedProperties = {}) {
    if (!key || typeof key !== 'string') throw new Error('Invalid key');
    if (typeof updatedProperties !== 'object' || updatedProperties === null) {
      throw new Error('updatedProperties must be an object');
    }
    const user = await this.get(key);
    const updatedUser = {
      ...user,
      ...updatedProperties,
      lastModified: Date.now(),
    };
    if (this.isJsonMode) {
      this.updateCache(key, updatedUser);
    } else {
      await this.mongo.bulkPut({ [key]: updatedUser });
      this.updateCache(key, updatedUser);
    }
    return updatedUser;
  }

  async getAll() {
    const allData = await this.getAllOld();
    const result = {};
    for (const key in allData) {
      result[key] = this.process(allData[key]);
      this.cache[key] = result[key];
    }
    return result;
  }

  async getAllOld() {
    if (this.isJsonMode) {
      return { ...this.cache };
    }
    return await this.mongo.toObject();
  }

  async toLeanObject() {
    if (this.isJsonMode) {
      return { ...this.cache };
    }
    try {
      const results = await this.mongo.KeyValue.find({}, "key value").lean();
      const resultObj = {};
      results.forEach((doc) => {
        resultObj[doc.key] = doc.value;
      });
      return resultObj;
    } catch (error) {
      if (this.mongo.ignoreError) {
        console.error(`Error getting entries for collection ${this.#collection}:`, error);
        return {};
      }
      throw error;
    }
  }
}

module.exports = UserStatsManager;