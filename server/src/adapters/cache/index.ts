import Redis from 'ioredis';
import ioredisLock from 'ioredis-lock';

import config from '../../config';

const cache = new Redis(config.redisConfig);

export default cache;

export const APP_KEY_PREFIX = `cinema-app-${process.env.MARKET || 'pt'}`;

export const lock = async (key, options) => {
  let cacheLock;
  if (!config.isCacheTypeRedis) {
    const dummyLock = {};
    return dummyLock;
  }

  try {
    cacheLock = await ioredisLock.createLock(cache, options);

    await cacheLock.acquire(key);
    console.log(`Lock acquired to '${key}'`);
  } catch (err) {
    console.log(`Tried to acquire lock to '${key}':`, err);
  }

  return cacheLock;
};

export const releaseLock = async cacheLock => {
  if (!config.isCacheTypeRedis) {
    return;
  }

  try {
    await cacheLock.release();
    console.log('Lock released!');
  } catch (error) {
    console.log('Tried to release lock', error);
  }
};
