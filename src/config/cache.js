import NodeCache from "node-cache";

// Create a new cache instance with the following configuration:
// - stdTTL: The standard Time-To-Live (TTL) for each cache entry, set to 100 seconds by default.
// - checkperiod: The interval at which the cache will automatically check for and remove expired entries, set to 120 seconds.
// - Create a cache with a default TTL of 5 minutes and a check period of 2 minutes
const SECONDS_IN_30_DAYS = 30 * 24 * 60 * 60; // 30 days in seconds
const cache = new NodeCache({ stdTTL: SECONDS_IN_30_DAYS, checkperiod: 120 });

// Export the cache instance for use throughout the application. This allows different parts of the app to share and access the same cache.
export default cache;
