/**
 * Deep Clone Implementation
 *
 * Create a deep copy of any JavaScript value, including nested objects,
 * arrays, and special types like Date, RegExp, Map, and Set.
 *
 * @param {*} value - The value to clone
 * @param {WeakMap} [visited] - WeakMap to track circular references (used internally)
 * @returns {*} A deep clone of the input value
 */
function deepClone(value, visited = new WeakMap()) {
  // TODO: Implement deep cloning

  // Step 1: Handle primitives (return as-is)
  // Primitives: null, undefined, number, string, boolean, symbol, bigint
  switch(typeof value){
    case 'null': return null;
    case 'boolean':
    case 'number':
    case 'bigint':
    case 'string':
    case 'symbol':
    case 'function':
    case 'undefined':
      return value;
  }

  // Step 2: Check for circular references using the visited WeakMap
  // If we've seen this object before, return the cached clone
  if(visited.has(value)){
    return visited.get(value);
  }

  // Step 3: Handle Date objects
  // Create a new Date with the same time value
  if(value instanceof Date){
    const clone = new Date(value.getTime());
    visited.set(value, clone);
    return clone;
  }

  // Step 4: Handle RegExp objects
  // Create a new RegExp with the same source and flags
  if(value instanceof RegExp){
    const clone = new RegExp(value.source, value.flags);
    visited.set(value, clone);
    return clone;
  }

  // Step 5: Handle Map objects
  // Create a new Map and deep clone each key-value pair
  if(value instanceof Map){
    const clone = new Map();
    visited.set(value, clone);

    for(let [key, v] of value.entries()){
      clone.set(deepClone(key, visited), deepClone(v, visited));
    }

    return clone;
  }

  // Step 6: Handle Set objects
  // Create a new Set and deep clone each value
  if(value instanceof Set){
    const clone = new Set();
    visited.set(value, clone);

    for(let v of value.values()){
      clone.add(deepClone(v, visited));
    }
    
    return clone;
  }

  // Step 7: Handle Arrays
  // Create a new array and deep clone each element
  if(Array.isArray(value)){
    const clone = [];
    visited.set(value, clone);

    for(let i = 0; i<value.length; i++){
      clone[i] = deepClone(value[i], visited);
    }
    
    return clone;
  }

  // Step 8: Handle plain Objects
  // Create a new object and deep clone each property
  if(typeof value === 'object' && !Array.isArray(value) && value !== null){
    const clone = {};
    visited.set(value, clone);

    const props = Object.getOwnPropertyNames(value);

    for(const prop of props){
      clone[prop] = deepClone(value[prop], visited);
    }

    return clone;
  }

  return value; // Broken: Replace with your implementation
}

module.exports = { deepClone };
