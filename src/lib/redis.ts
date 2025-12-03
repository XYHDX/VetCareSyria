import { Redis } from '@upstash/redis';
import fs from 'fs/promises';
import path from 'path';

// In-memory + file-backed fallback store for local development
type LocalStore = Record<string, unknown>;
const LOCAL_STORE_PATH = path.join(process.cwd(), '.data', 'local-store.json');
let localCache: LocalStore | null = null;

const loadLocalStore = async (): Promise<LocalStore> => {
  if (localCache) return localCache;
  try {
    const data = await fs.readFile(LOCAL_STORE_PATH, 'utf8');
    localCache = JSON.parse(data) as LocalStore;
  } catch {
    localCache = {};
  }
  return localCache;
};

const persistLocalStore = async (store: LocalStore) => {
  await fs.mkdir(path.dirname(LOCAL_STORE_PATH), { recursive: true });
  await fs.writeFile(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
};

const localGet = async <T>(key: string): Promise<T | null> => {
  const store = await loadLocalStore();
  return (store[key] as T) ?? null;
};

const localSet = async <T>(key: string, value: T): Promise<void> => {
  const store = await loadLocalStore();
  store[key] = value as unknown;
  await persistLocalStore(store);
};

// Create a function that returns a Redis client
// This ensures the client is only created at runtime, not during build
let redisClient: Redis | null = null;
let redisConfigured: boolean | null = null;

const isRedisConfigured = () => {
  if (redisConfigured !== null) return redisConfigured;
  redisConfigured =
    !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    !!(process.env.UPSTASH_REDIS_KV_REST_API_URL && process.env.UPSTASH_REDIS_KV_REST_API_TOKEN);
  return redisConfigured;
};

export function getRedisClient(): Redis | null {
  if (!isRedisConfigured()) return null;
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;

  if (!url || !token) return null;

  redisClient = new Redis({ url, token });
  return redisClient;
}

// For backward compatibility with a resilient fallback
export const redis = {
  get: async function <T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    if (client) {
      try {
        return await client.get(key);
      } catch (err) {
        console.error('Redis GET failed, falling back to local store:', err);
      }
    }
    return localGet<T>(key);
  },
  set: async function <T>(key: string, value: T): Promise<unknown> {
    const client = getRedisClient();
    if (client) {
      try {
        return await client.set(key, value);
      } catch (err) {
        console.error('Redis SET failed, falling back to local store:', err);
      }
    }
    return localSet<T>(key, value);
  },
  isConfigured: isRedisConfigured
  // Add other Redis methods you use in your application
};
