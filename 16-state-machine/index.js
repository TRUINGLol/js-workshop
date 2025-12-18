/**
 * State Machine Implementation
 */
class StateMachine {
  /**
   * Create a state machine
   * @param {Object} config - Machine configuration
   * @param {string} config.initial - Initial state
   * @param {Object} config.states - State definitions
   * @param {Object} [config.context] - Initial context data
   */
  constructor(config) {
    // TODO: Implement constructor
    // Step 1: Validate config has initial and states

    if(!config){
      throw new Error('configuration is required');
    }
    if(!config.initial){
      throw new Error('initial state is required');
    }
    if(!config.states || typeof config.states !== 'object'){
      throw new Error('states configuration is required');
    }

    // Step 2: Store configuration
    this.config = config;
    this.currentState = config.initial;
    this.context = config.context || {};
    // Step 3: Validate initial state exists in states
    if (!config.states[config.initial]) {
      throw new Error('initial state is not defined in states');
    }
  }

  /**
   * Get current state
   * @returns {string}
   */
  get state() {
    // TODO: Return current state
    return this.currentState;
  }

  /**
   * Attempt a state transition
   * @param {string} event - Event name
   * @param {Object} [payload] - Optional data for the transition
   * @returns {boolean} Whether transition was successful
   */
  transition(event, payload) {
    // TODO: Implement transition

    // Step 1: Get current state config
    const currentStateConfig = this.config.states[this.currentState];

    // Step 2: Check if event is valid for current state
    // Return false if not
    if(!currentStateConfig.on || !currentStateConfig.on[event]){
      return false;
    }

    // Step 3: Get transition config (can be string or object)
    // If string: target = transition
    // If object: { target, guard, action }
    const transitionConfig = currentStateConfig.on[event];
    
    let targetState;
    let guard = null;
    let action = null;

    if(typeof transitionConfig === 'string'){
      targetState = transitionConfig;
    }
    else if(typeof transitionConfig === 'object'){
      targetState = transitionConfig.target;
      guard = transitionConfig.guard;
      action = transitionConfig.action;
    }
    else{
      return false;
    }

    if(!this.config.states[targetState]){
      throw new Error('state is not defined');
    }

    // Step 4: Check guard if present
    // If guard returns false, return false
    if(guard && typeof guard === 'function'){
      const guardResult = guard(this.context, payload);
      if(guardResult === false){
        return false;
      }
    }

    // Step 5: Update state to target
    const previousState = this.currentState;
    this.currentState = targetState;

    // Step 6: Call action if present
    if(action && typeof action === 'function'){
      action(this.context, payload,{
        from: previousState,
        to: targetState,
        event
      });
    }

    // Step 7: Return true
    return true;
  }

  /**
   * Check if a transition is possible
   * @param {string} event - Event name
   * @returns {boolean}
   */
  can(event) {
    // TODO: Implement can

    // Check if event exists for current state
    // Check guard if present

    const currentStateConfig = this.config.states[this.currentState];
    
    if(!currentStateConfig.on || !currentStateConfig.on[event]){
      return false;
    }

    const transitionConfig = currentStateConfig.on[event];

    if(typeof transitionConfig === 'object' && transitionConfig.guard){
      const guardResult = transitionConfig.guard(this.context);
      return guardResult !== false;
    }

    return true;
  }

  /**
   * Get available transitions from current state
   * @returns {string[]} Array of event names
   */
  getAvailableTransitions() {
    // TODO: Implement getAvailableTransitions

    // Return array of event names from current state's 'on' config
    const currentStateConfig = this.config.states[this.currentState];
    
    if(!currentStateConfig.on){
      return [];
    }

    return Object.keys(currentStateConfig.on).filter(event => this.can(event));
  }

  /**
   * Get the context data
   * @returns {Object}
   */
  getContext() {
    // TODO: Return context
    return { ...this.context };
  }

  /**
   * Update context data
   * @param {Object|Function} updater - New context or updater function
   */
  updateContext(updater) {
    // TODO: Implement updateContext
    // If updater is function: this.context = updater(this.context)
    // If updater is object: merge with existing context

    if(typeof updater === 'function'){
      this.context = updater(this.context);
    }
    else if(typeof updater === 'object'){
      this.context = { ...this.context, ...updater };
    }
    else{
      throw new Error('must be a function or object');
    }
  }

  /**
   * Check if machine is in a final state (no transitions out)
   * @returns {boolean}
   */
  isFinal() {
    // TODO: Check if current state has no transitions

    const currentStateConfig = this.config.states[this.currentState];

    return !currentStateConfig.on || Object.keys(currentStateConfig.on).length === 0;
  }

  /**
   * Reset machine to initial state
   * @param {Object} [newContext] - Optional new context
   */
  reset(newContext) {
    // TODO: Reset to initial state
    // Optionally reset context
    this.currentState = this.config.initial;
    if(newContext !== undefined){
      this.context = newContext;
    }
    else{
      this.context = this.config.context ? { ...this.config.context } : {};
    }
  }
}

/**
 * Create a state machine factory
 *
 * @param {Object} config - Machine configuration
 * @returns {Function} Factory function that creates machines
 */
function createMachine(config) {
  // TODO: Implement createMachine

  // Return a function that creates new StateMachine instances
  // with the given config

  if(!config || !config.initial || !config.states){
    throw new Error('err');
  }

  return ()=> new StateMachine(config);
}

module.exports = { StateMachine, createMachine };
