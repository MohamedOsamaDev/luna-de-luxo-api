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
export const cachePath = (key, value, stdTTL, admin = null) => {
  try {
    if (!key?.toString() || !value) return;
    let adminKey = admin ? `-admin` : "";
    let result = cache.set(`${key}${adminKey}`, value, stdTTL);
  } catch (error) {}
  return true;
};
export const cachPathes = (key, value, stdTTL, admin = null) => {
  try {
    let adminKey = admin ? `-admin` : "";
    let groupKey = `${getCoresegment(key)}${adminKey}`;
    let data = cache.get(groupKey) || {};
    data[`${key}${adminKey}`] = value;
    cache.set(groupKey, data, stdTTL);
  } catch (error) {}
  return true;
};
export const getCachedPath = (key, admin = null) => {
  try {
    let adminKey = admin ? `-admin` : "";
    let result =
      cache.get(`${key}${adminKey}`) ||
      cache.get(`${getCoresegment(key)}${adminKey}`)?.[`${key}${adminKey}`] ||
      null;
    return result;
  } catch (error) {}
  return null;
};
export const revaildatePath = (keys) => {
  try {
    let Allkeys =  [...keys,...keys?.map((key) => `${key}-admin`)].filter(Boolean);
    let result = cache.del(Allkeys);
    return result;
  } catch (error) {
    console.log("🚀 ~ revaildatePath ~ error:", error)
  }
  return null;
};
export const updatetTTL = (key, sttl = "1h") => {
  try {
    let value = cache.get(key, timeToSeconds(sttl));
    if (value) {
      cache.ttl(key);
    }
  } catch (error) {}
  return true;
};
