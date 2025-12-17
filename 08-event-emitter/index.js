/**
 * Event Emitter Implementation
 *
 * A pub/sub event system similar to Node.js EventEmitter.
 */
class EventEmitter {
  constructor() {
    // TODO: Initialize event storage
    this.events = new Map();
  }

  /**
   * Register a listener for an event
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {EventEmitter} this (for chaining)
   */
  on(event, listener) {
    // TODO: Implement on

    // Step 1: Get or create the listeners array for this event
    if(!this.events.has(event)){
      this.events.set(event, []);
    }

    // Step 2: Add the listener to the array
    const listeners = this.events.get(event);
    listeners.push(listener);

    // Step 3: Return this for chaining
    return this;
  }

  /**
   * Remove a specific listener for an event
   * @param {string} event - Event name
   * @param {Function} listener - Callback to remove
   * @returns {EventEmitter} this (for chaining)
   */
  off(event, listener) {
    // TODO: Implement off

    // Step 1: Get the listeners array for this event
    const listeners = this.events.get(event);

    if(!listeners){
      return this;
    }

    // Step 2: Find and remove the listener
    // Note: Handle wrapped 'once' listeners
    for(let i = listeners.length - 1; i >= 0; i--){
      const currentListener = listeners[i];
      
      if(currentListener === listener || currentListener.listener === listener){
        listeners.splice(i, 1);
      }
    }

    if(listeners.length === 0){
      this.events.delete(event);
    }

    // Step 3: Return this for chaining
    return this;
  }

  /**
   * Emit an event, calling all registered listeners
   * @param {string} event - Event name
   * @param {...*} args - Arguments to pass to listeners
   * @returns {boolean} true if event had listeners
   */
  emit(event, ...args) {
    // TODO: Implement emit

    // Step 1: Get the listeners array for this event
    const listeners = this.events.get(event);

    // Step 2: If no listeners, return false
    if(!listeners || listeners.length === 0){
      return false;
    }

    // Step 3: Call each listener with the arguments
    // Make a copy of the array to handle removals during emit
    const listenersCopy = [...listeners];

    for (const listener of listenersCopy) {
      try{
        if(typeof listener === 'function'){
          listener.apply(this, args);
        }
      }
      catch(error){
        if(event !== 'error' && this.events.has('error')){
          this.emit('error', error);
        }
      }
    }

    // Step 4: Return true
    return true;
  }

  /**
   * Register a one-time listener
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {EventEmitter} this (for chaining)
   */
  once(event, listener) {
    // TODO: Implement once

    // Step 1: Create a wrapper function that:
    //   - Removes itself after being called
    //   - Calls the original listener with arguments
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };

    // Step 2: Store reference to original listener for 'off' to work
    wrapper.listener = listener;

    // Step 3: Register the wrapper with 'on'
    this.on(event, wrapper);

    // Step 4: Return this for chaining
    return this;
  }

  /**
   * Remove all listeners for an event (or all events)
   * @param {string} [event] - Event name (optional)
   * @returns {EventEmitter} this (for chaining)
   */
  removeAllListeners(event) {
    // TODO: Implement removeAllListeners
    if(event !== undefined){
      this.events.delete(event);
    }
    else{
      this.events.clear();
    }
    
    return this;
  }

  /**
   * Get array of listeners for an event
   * @param {string} event - Event name
   * @returns {Function[]} Array of listener functions
   */
  listeners(event) {
    // TODO: Implement listeners
    const listeners = this.events.get(event);

    // Return copy of listeners array, or empty array if none
    return listeners ? [...listeners] : [];
  }

  /**
   * Get number of listeners for an event
   * @param {string} event - Event name
   * @returns {number} Listener count
   */
  listenerCount(event) {
    // TODO: Implement listenerCount
    const listeners = this.events.get(event);
    return listeners ? listeners.length : 0;
  }
}

module.exports = { EventEmitter };
