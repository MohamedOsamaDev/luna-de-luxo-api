import cache from "../config/cache.js";

export const cachePath = (key, value, stdTTL) => {
  try {
    if (!key?.toString() || !value) return;
    let result = cache.set(key, value, stdTTL);
  } catch (error) {
    console.error(`Error caching data: ${error.message}`);
  }
  return true;
};

export const getCachedPath = (key) => {
  try {
    return cache.get(key);
  } catch (error) {
    console.error(`Error retrieving data from cache: ${error.message}`);
  }
  return null;
};

export const revaildatePath = (key) => {
  try {
    const cacheValue = getCachedPath(key);
    if (!cacheValue) return false;
    cache.del(key);
    return true;
  } catch (error) {}
  return null;
};

export const customCachPath = async (key, value, mode = "public") => {
  try {
    let Pathkey = `${mode}/${key}`;
    return cachePath(Pathkey, value);
  } catch (error) {
    console.error(`Error caching data: ${error.message}`);
  }
  return true;
};
