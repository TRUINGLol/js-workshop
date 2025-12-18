/**
 * Proxy Pattern Implementation
 */

/**
 * Create a validating proxy
 *
 * @param {Object} target - Target object
 * @param {Object} validators - Map of property name to validator function
 * @returns {Proxy} Proxy that validates on set
 */
function createValidatingProxy(target, validators) {
  // TODO: Implement validating proxy

  // Create a Proxy with a handler that:
  // - On 'set': check if validator exists for property
  //   - If validator returns false, throw Error
  //   - Otherwise, set the property
  // - On 'get': return property value normally

  return new Proxy(target, {
    set(obj, prop, value) {
      // TODO: Implement set trap
      // Check validators[prop](value) if validator exists
      if(validators && validators[prop]){
        const isValid = validators[prop](value);
        if(!isValid){
          throw new Error('failed');
        }
      }
      // Throw if validation fails
      // Set property if passes
      obj[prop] = value;
      return true;
    },

    get(obj, prop) {
      // TODO: Implement get trap
      return obj[prop];
    },
  });
}

/**
 * Create a logging proxy
 *
 * @param {Object} target - Target object
 * @param {Function} logger - Logging function (action, prop, value) => void
 * @returns {Proxy} Proxy that logs all operations
 */
function createLoggingProxy(target, logger) {
  // TODO: Implement logging proxy

  return new Proxy(target, {
    get(obj, prop) {
      // TODO: Log 'get' and return value
      const value = obj[prop];
      logger('get', prop, value);
      return value;
    },

    set(obj, prop, value) {
      // TODO: Log 'set' and set value
      const oldValue = obj[prop];
      obj[prop] = value;
      logger('set', prop, value, oldValue);
      return true;
    },

    deleteProperty(obj, prop) {
      // TODO: Log 'delete' and delete property
      const oldValue = obj[prop];
      const result = delete obj[prop];
      logger('delete', prop, oldValue);
      return result;
    },

    has(obj, prop) {
      // TODO: Log 'has' and return result
      const result = prop in obj;
      logger('has', prop, result);
      return result;
    },
  });
}

/**
 * Create a caching proxy for methods
 *
 * @param {Object} target - Target object with methods
 * @param {string[]} methodNames - Names of methods to cache
 * @returns {Proxy} Proxy that caches method results
 */
function createCachingProxy(target, methodNames) {
  // TODO: Implement caching proxy

  // Create cache storage
  const cache = new Map();

  return new Proxy(target, {
    get(obj, prop) {
      // TODO: Implement get trap

      // If prop is in methodNames and is a function:
      //   Return a wrapped function that:
      //   - Creates cache key from arguments
      //   - Returns cached result if exists
      //   - Otherwise, calls original, caches, and returns
      const original = obj[prop];

      if(methodNames.includes(prop) && typeof original === 'function'){
        return function(...args){
          const cacheKey = `${prop}_${JSON.stringify(args)}`;

          if(cache.has(cacheKey)){
            return cache.get(cacheKey);
          }

          const result = original.apply(obj, args);
          cache.set(cacheKey, result);
          return result;
        };
      }

      // Otherwise, return property normally
      return original;
    },
  });
}

/**
 * Create an access control proxy
 *
 * @param {Object} target - Target object
 * @param {Object} permissions - Access permissions
 * @param {string[]} permissions.readable - Properties that can be read
 * @param {string[]} permissions.writable - Properties that can be written
 * @returns {Proxy} Proxy that enforces access control
 */
function createAccessProxy(target, permissions) {
  // TODO: Implement access control proxy

  const { readable = [], writable = [] } = permissions;

  return new Proxy(target, {
    get(obj, prop) {
      // TODO: Check if prop is in readable
      // Throw if not allowed
      // Broken: returns wrong value
      if(!readable.includes(prop)){
        throw new Error('not allowed');
      }
      return obj[prop];
    },

    set(obj, prop, value) {
      // TODO: Check if prop is in writable
      // Throw if not allowed
      // Broken: doesn't actually set
      if(!writable.includes(prop)){
        throw new Error('not allowed');
      }
      obj[prop] = value;
      return true;
    },

    deleteProperty(obj, prop) {
      // TODO: Only allow if in writable
      // Broken: doesn't delete
      if(!writable.includes(prop)){
        throw new Error('not allowed');
      }
      delete obj[prop];
      return true;
    },
  });
}

/**
 * Create a lazy loading proxy
 *
 * @param {Function} loader - Function that returns the real object
 * @returns {Proxy} Proxy that loads object on first access
 */
function createLazyProxy(loader) {
  // TODO: Implement lazy loading proxy

  let instance = null;
  let loaded = false;

  return new Proxy(
    {},
    {
      get(obj, prop) {
        // TODO: Load instance on first access
        // if (!loaded) { instance = loader(); loaded = true; }
        // return instance[prop]
        if(!loaded){ 
          instance = loader(); 
          loaded = true; 
        }
        return instance[prop];
      },

      set(obj, prop, value) {
        // TODO: Load instance if needed, then set
        if(!loaded){ 
          instance = loader(); 
          loaded = true; 
        }
        instance[prop] = value;
        return true;
      },
    },
  );
}

/**
 * Create an observable proxy
 *
 * @param {Object} target - Target object
 * @param {Function} onChange - Callback when property changes
 * @returns {Proxy} Proxy that notifies on changes
 */
function createObservableProxy(target, onChange) {
  // TODO: Implement observable proxy

  return new Proxy(target, {
    set(obj, prop, value) {
      // TODO: Call onChange(prop, value, oldValue) on change
      const oldValue = obj[prop];

      if(oldValue !== value){
        obj[prop] = value;
        onChange(prop, value, oldValue);
      }
      return true;
    },

    deleteProperty(obj, prop) {
      // TODO: Call onChange on delete
      const oldValue = obj[prop];
      delete obj[prop];
      onChange(prop, undefined, oldValue);
      return true;
    },
  });
}

module.exports = {
  createValidatingProxy,
  createLoggingProxy,
  createCachingProxy,
  createAccessProxy,
  createLazyProxy,
  createObservableProxy,
};
