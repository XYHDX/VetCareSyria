import { redis } from './redis';

type MetaMap = Record<string, string>;

const META_KEY = 'admin_meta';

export const setUpdatedAt = async (key: string) => {
  const meta = (await redis.get<MetaMap>(META_KEY)) || {};
  meta[key] = new Date().toISOString();
  await redis.set(META_KEY, meta);
};

export const getUpdatedAt = async (key: string): Promise<string | undefined> => {
  const meta = (await redis.get<MetaMap>(META_KEY)) || {};
  return meta[key];
};
