/**
 * Memoization Implementation
 *
 * Creates a memoized version of a function that caches results based on arguments.
 *
 * @param {Function} fn - The function to memoize
 * @param {Object} [options] - Optional configuration
 * @param {number} [options.maxSize] - Maximum number of cached entries
 * @param {number} [options.ttl] - Time-to-live for cache entries in milliseconds
 * @param {Function} [options.keyGenerator] - Custom function to generate cache keys
 * @returns {Function} Memoized function with cache control methods
 */
function memoize(fn, options = {}) {
  // TODO: Implement memoization

  // Step 1: Extract options with defaults
  // const { maxSize, ttl, keyGenerator } = options;
  const {maxSize, ttl, keyGenerator} = options;

  // Step 2: Create the cache (use Map for ordered keys)
  // const cache = new Map();
  const cache = new Map();

  // Step 3: Create default key generator
  // Default: JSON.stringify(args) or args.join(',')
  const defaultKeyGenerator = (...args)=>JSON.stringify(args);
  const getKey = keyGenerator || defaultKeyGenerator;

  // Step 4: Create the memoized function
  // - Generate cache key from arguments
  // - Check if key exists and is not expired (TTL)
  // - If cached, return cached value
  // - If not cached, call fn and store result
  // - Handle maxSize eviction (remove oldest)
  const isExpired = (entry)=>{
    if (!ttl || !entry.timestamp) return false;
    return Date.now() - entry.timestamp > ttl;
  };

  const cleanExpired = () =>{
    if (!ttl) return;
    for (const [key, entry] of cache.entries()) {
      if (isExpired(entry)) {
        cache.delete(key);
      }
    }
  };

  const memoFn = function(...args){
    const cacheKey = getKey(args);

    if(cache.has(cacheKey)){
      const entry = cache.get(cacheKey);

      if(!isExpired(entry)){
        return entry.value;
      }
      else{
        cache.delete(cacheKey);
      }
    }

    const result = fn.apply(this, args);

    cleanExpired();

    if (maxSize && cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    const entry = {
      value: result,
      timestamp: ttl ? Date.now() : null
    };

    cache.set(cacheKey, entry);

    return result;
  }

  // Step 5: Add cache control methods
  // memoized.cache = {
  //   clear: () => cache.clear(),
  //   delete: (key) => cache.delete(key),
  //   has: (key) => cache.has(key),
  //   get size() { return cache.size; }
  // };
  memoFn.cache = {
    clear: ()=>cache.clear(),
    delete: (...args)=>{
      const key = getKey(args);
      return cache.delete(key);
    },
    has: (...args)=>{
      const key = getKey(args);
      if (!cache.has(key)) return false;
      
      const entry = cache.get(key);
      if (isExpired(entry)) {
        cache.delete(key);
        return false;
      }
      
      return true;
    },
    get size(){
      cleanExpired();
      return cache.size;
    }
  };


  // Step 6: Return memoized function
  return memoFn;

  // // Return placeholder that doesn't work
  // const memoized = function () {
  //   return undefined;
  // };
  // memoized.cache = {
  //   clear: () => {},
  //   delete: () => false,
  //   has: () => false,
  //   get size() {
  //     return -1;
  //   },
  // };
  // return memoized;
}

module.exports = { memoize };
