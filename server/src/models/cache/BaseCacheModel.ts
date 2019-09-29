import { upperFirst } from 'lodash';

import cache, { lock, releaseLock } from '../../adapters/cache';

const makeProxy = self => {
  const proxy = new Proxy(self, {
    get(target, propKey: string, receiver) {
      const originalProp = Reflect.get(target, propKey, receiver);

      if (typeof originalProp === 'undefined') {
        // eslint-disable-next-line security/detect-object-injection
        return self && self.data ? self.data[propKey] : undefined;
      }

      if (!['save', 'update'].includes(propKey)) {
        return originalProp;
      }

      /* eslint-disable func-names */
      return async function (...args) {
        // Invoke pre hook
        await receiver[`pre${upperFirst(propKey)}`](...args);

        // Validate model
        await receiver.validate();

        // Invoke actual method
        await originalProp.apply(receiver, args);
      };
      /* eslint-enable func-names */
    },
  });

  return proxy;
};

export default class BaseCacheModel {
  private cacheLock;
  private data;
  private key;
  private ttl;

  constructor(data) {
    this.cacheLock = undefined;
    this.data = data;

    // Validate presence of mandatory static methods
    if (
      !Reflect.has(this.constructor, 'getType') ||
      !Reflect.has(this.constructor, 'getKey')
    ) {
      throw new Error('Model must implement `getType`, `getKey` and `getSchema` static methods');
    }

    // Validate presence of mandatory instance methods
    if (!Reflect.has(this, 'key') || !Reflect.has(this, 'ttl')) {
      throw new Error('Model must implement `key` and `ttl` getter');
    }

    return makeProxy(this);
  }

  public getType() {
  }

  public validate() {
    const type = (this.constructor as any).getType();
    return true;
  }

  public isLocked() {
    return !!this.cacheLock;
  }

  public async lock(options) {
    this.cacheLock = await lock(`${this.key}:lock`, options);
  }

  public async releaseLock() {
    if (!this.cacheLock) {
      console.log('Trying to release lock that does not exist...');
      return;
    }

    await releaseLock(this.cacheLock);
    this.cacheLock = undefined;
  }

  public async preSave() {
    this.data.updatedAt = Date.now();
    if (!this.data.createdAt) {
      this.data.createdAt = Date.now();
    }
  }

  public async save() {
    console.log(`Cache > Save > ${this.key} > Data ${!!this.data}`);

    const args = [this.key, JSON.stringify(this.data)];

    if (this.ttl) {
      args.push('EX'); // seconds
      args.push(this.ttl);
    }

    await cache.set(...args, err => {
      if (err) {
        console.log(`Models > BaseCacheModel > Save > cache.set:`, err);
      }
    });
  }

  public static async loadByKey({ key, json }) {
    const result = {
      data: {},
    };

    const flatData = await cache.get(key);
    if (json && flatData) {
      try {
        result.data = JSON.parse(flatData);
      } catch (error) {
        console.log('Models > BaseCacheModel > loadByKey', error);
      }
    }
    return result;
  }
}
