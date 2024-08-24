import cache from "../config/cache.js";
import { timeToSeconds } from "./formateTime.js";

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
    cache.del(key);
    return true;
  } catch (error) {}
  return null;
};

export const updatetTTL = (key, sttl = "1h") => {
  try {
    let value = cache.get(key, timeToSeconds(sttl));
    if (value) {
      cache.ttl(key);
    }
  } catch (error) {
    console.error(`Error updating TTL for data: ${error.message}`);
  }
  return true;
};
