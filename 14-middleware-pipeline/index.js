/**
 * Middleware Pipeline Implementation
 *
 * An Express/Koa-style middleware pipeline.
 */
class Pipeline {
  constructor() {
    // TODO: Initialize middleware array
    this.middleware = [];
  }

  /**
   * Add middleware to the pipeline
   * @param {Function} fn - Middleware function (ctx, next) => {}
   * @returns {Pipeline} this (for chaining)
   */
  use(fn) {
    // TODO: Implement use

    // Step 1: Validate fn is a function
    if(typeof fn !== 'function'){
      throw new Error('must be a function');
    }

    // Step 2: Add to middleware array
    this.middleware.push(fn);

    // Step 3: Return this for chaining
    return this;
  }

  /**
   * Execute the pipeline with given context
   * @param {Object} context - Context object passed to all middleware
   * @returns {Promise} Resolves when pipeline completes
   */
  run(context) {
    // TODO: Implement run

    // Step 1: Create a dispatch function that:
    //   - Takes an index
    //   - Gets middleware at that index
    //   - If no middleware, resolve
    //   - Otherwise, call middleware with context and next function
    //   - next = () => dispatch(index + 1)
    const dispatch = (index)=>{
      if(index >= this.middleware.length){
        return Promise.resolve();
      }

      const middleware = this.middleware[index];
      
      try{
        const next = ()=>dispatch(index + 1);
        
        const result = middleware(context, next);
        
        return Promise.resolve(result);
      }
      catch (error){
        return Promise.reject(error);
      }
    };


    // Step 2: Start dispatch at index 0

    // Step 3: Return promise for async support
    return dispatch(0);
  }

  /**
   * Compose middleware into a single function
   * @returns {Function} Composed middleware function
   */
  compose() {
    // TODO: Implement compose

    // Return a function that takes context and runs the pipeline

    return (context) => this.run(context);
  }
}

/**
 * Compose function (standalone)
 *
 * Composes an array of middleware into a single function.
 *
 * @param {Function[]} middleware - Array of middleware functions
 * @returns {Function} Composed function (context) => Promise
 */
function compose(middleware) {
  // TODO: Implement compose

  // Validate all items are functions
  if(!Array.isArray(middleware)){
    throw new TypeError('must be an array');
  }

  for(const fn of middleware){
    if(typeof fn !== 'function'){
      throw new TypeError('must be composed of functions');
    }
  }

  // Return a function that:
  // - Takes context
  // - Creates dispatch(index) that calls middleware[index]
  // - Returns dispatch(0)

  return function (context) {
    let currentIndex = -1;

    function dispatch(index){
      if(index <= currentIndex){
        return Promise.reject(new Error('stackoverflow'));
      }
      currentIndex = index;
      
      const fn = middleware[index];

      if(!fn){
        return Promise.resolve();
      }
      
      try{
        return Promise.resolve(fn(context, ()=>dispatch(index + 1)));
      }
      catch (error){
        return Promise.reject(error);
      }
    }

    return dispatch(0);
  };
}

/**
 * Create a middleware that runs conditionally
 *
 * @param {Function} condition - (ctx) => boolean
 * @param {Function} middleware - Middleware to run if condition is true
 * @returns {Function} Conditional middleware
 */
function when(condition, middleware) {
  // TODO: Implement when

  // Return middleware that:
  // - Checks condition(ctx)
  // - If true, runs middleware
  // - If false, just calls next()

  return (ctx, next)=>{
    if(condition(ctx)){
      const result = middleware(ctx, next);
      return Promise.resolve(result);
    }
    else{
      const result = next();
      return Promise.resolve(result);
    }
  };
}

/**
 * Create a middleware that handles errors
 *
 * @param {Function} errorHandler - (error, ctx) => {}
 * @returns {Function} Error handling middleware
 */
function errorMiddleware(errorHandler) {
  // TODO: Implement errorMiddleware

  // Return middleware that:
  // - Wraps next() in try/catch
  // - Calls errorHandler if error thrown

  return async (ctx, next) => {
    try{
      const result = next();
      return Promise.resolve(result).catch(error=>{
        errorHandler(error, ctx);
      });
    }
    catch(error){
      errorHandler(error, ctx);
      return Promise.resolve();
    }
  };
}

module.exports = {
  Pipeline,
  compose,
  when,
  errorMiddleware,
};
