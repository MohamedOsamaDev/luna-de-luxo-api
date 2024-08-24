import cache from "../config/cache.js";
import { timeToSeconds } from "./formateTime.js";

export const getCoresegment = (key) => {
  try {
    return key?.match(/^\/api\/([^\/\?\s]+)/)?.[1] || "";
  } catch (error) {}
  return "";
};
export const filterMatchingPaths = (target, paths) => {
  // Use an empty array instead of Set to maintain order
  const filteredUrls = [];

  // Extract core segment from the target URL once
  const coreSegment = target?.match(/^\/api\/([^\/\?\s]+)/)?.[1] || "";
  if (!coreSegment) return filteredUrls;

  // Precompute special conditions
  const specialConditions = new Set([target]);

  // Iterate through paths and filter
  for (const url of paths || []) {
    if (
      specialConditions.has(url) ||
      (url.includes(`/${coreSegment}`) &&
        (url.includes(`/${coreSegment}/`) || url.includes(`/${coreSegment}?`)))
    ) {
      filteredUrls.push(url);
    }
  }

  return filteredUrls;
};
export const cachePath = (key, value, stdTTL) => {
  try {
    if (!key?.toString() || !value) return;
    let result = cache.set(key, value, stdTTL);
  } catch (error) {
    console.error(`Error caching data: ${error.message}`);
  }
  return true;
};
export const cachPathes = (key, value, stdTTL) => {
  try {
    let groupKey = getCoresegment(key);
    let data = cache.get(groupKey) || {};
    data[key] = value;
    cache.set(groupKey, data, stdTTL);
  } catch (error) {
    console.error(`Error caching data: ${error.message}`);
  }
  return true;
};
export const getCachedPath = (key) => {
  try {
    return cache.get(key) || cache.get(getCoresegment(key))?.[key] || false;
  } catch (error) {
    console.error(`Error retrieving data from cache: ${error.message}`);
  }
  return null;
};
export const revaildatePath = (key) => {
  console.log("🚀 ~ revaildatePath ~ key:", key);
  try {
    let groupKey = key;
    let keys = [];
    if (Array.isArray(key)) {
      keys = [getCoresegment(key?.[0]), ...key];
    } else {
      keys = [getCoresegment(key), key];
    }
    console.log(keys);

    cache.del(keys);
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
