/**
 * Dependency Injection Container Implementation
 */
class Container {
  constructor() {
    // TODO: Initialize registry
    this.registry = new Map();
  }

  /**
   * Register a class with the container
   * @param {string} name - Service name
   * @param {Function} Class - Constructor function
   * @param {string[]} [dependencies=[]] - Names of dependencies
   * @param {Object} [options={}] - Registration options
   * @param {boolean} [options.singleton=false] - Whether to create singleton
   */
  register(name, Class, dependencies = [], options = {}) {
    // TODO: Implement register
    // Store in registry:
    // { type: 'class', Class, dependencies, singleton, instance: null }
    if(typeof Class !== 'function'){
      throw new Error('must be function');
    }

    this.registry.set(name,{
      type: 'class',
      Class,
      dependencies,
      singleton: !!options.singleton,
      instance: null
    });
    
    return this;
  }

  /**
   * Register an existing instance
   * @param {string} name - Service name
   * @param {*} instance - Instance to register
   */
  registerInstance(name, instance) {
    // TODO: Implement registerInstance
    // Store in registry:
    // { type: 'instance', instance }
    if(instance === undefined || instance === null){
      throw new Error('cannot be null or undefined');
    }

    this.registry.set(name,{
      type: 'instance',
      instance
    });
    
    return this;
  }

  /**
   * Register a factory function
   * @param {string} name - Service name
   * @param {Function} factory - Factory function
   * @param {string[]} [dependencies=[]] - Names of dependencies
   * @param {Object} [options={}] - Registration options
   */
  registerFactory(name, factory, dependencies = [], options = {}) {
    // TODO: Implement registerFactory
    // Store in registry:
    // { type: 'factory', factory, dependencies, singleton, instance: null }
    if(typeof factory !== 'function'){
      throw new Error('must be a function');
    }

    this.registry.set(name,{
      type: 'factory',
      factory,
      dependencies,
      singleton: !!options.singleton,
      instance: null
    });
    
    return this;
  }

  /**
   * Resolve a service by name
   * @param {string} name - Service name
   * @param {Set} [resolutionStack] - Stack for circular dependency detection
   * @returns {*} The resolved instance
   */
  resolve(name, resolutionStack = new Set()) {
    // TODO: Implement resolve

    // Step 1: Check if service is registered
    // Throw error if not found
    if(!this.registry.has(name)){
      throw new Error('not registered');
    }

    // Step 2: Check for circular dependencies
    // If name is already in resolutionStack, throw error
    if(resolutionStack.has(name)){
      throw new Error('Circular dependency detected');
    }

    // Step 3: Get registration from registry
    const registration = this.registry.get(name);

    // Step 4: Handle different types:
    switch (registration.type) {
      case 'instance':
        return registration.instance;

      case 'class':
      case 'factory':
        if(registration.singleton && registration.instance){
          return registration.instance;
        }

        resolutionStack.add(name);

        const dependencies = registration.dependencies.map(depName=>this.resolve(depName, resolutionStack));

        resolutionStack.delete(name);

        let instance;
        if(registration.type === 'class'){
          instance = new registration.Class(...dependencies);
        }
        else{
          instance = registration.factory(...dependencies);
        }

        if(registration.singleton){
          registration.instance = instance;
        }
        return instance;

      default:
        throw new Error('unknown type');
    }

    // For 'instance':
    //   - Return the stored instance

    // For 'class' or 'factory':
    //   - If singleton and instance exists, return instance
    //   - Add name to resolutionStack
    //   - Resolve all dependencies recursively
    //   - Create instance (new Class(...deps) or factory(...deps))
    //   - Remove name from resolutionStack
    //   - If singleton, cache instance
    //   - Return instance
  }

  /**
   * Check if a service is registered
   * @param {string} name - Service name
   * @returns {boolean}
   */
  has(name) {
    // TODO: Implement has
    return this.registry.has(name);
  }

  /**
   * Unregister a service
   * @param {string} name - Service name
   * @returns {boolean} true if was registered
   */
  unregister(name) {
    // TODO: Implement unregister
    return this.registry.delete(name);
  }

  /**
   * Clear all registrations
   */
  clear() {
    // TODO: Implement clear
    this.registry.clear();
    return this;
  }

  /**
   * Get all registered service names
   * @returns {string[]}
   */
  getRegistrations() {
    // TODO: Implement getRegistrations
    return Array.from(this.registry.keys());
  }
}

/**
 * Create a child container that inherits from parent
 *
 * @param {Container} parent - Parent container
 * @returns {Container} Child container
 */
function createChildContainer(parent) {
  // TODO: Implement createChildContainer

  // Create a new container that:
  // - First checks its own registry
  // - Falls back to parent for unregistered services

  const child = new Container();
  // Override resolve to check parent...
  const originalResolve = child.resolve.bind(child);

  child.resolve = function(name, resolutionStack = new Set()){
    if(this.registry.has(name)){
      return originalResolve(name, resolutionStack);
    }

    if(parent && typeof parent.resolve === 'function'){
      return parent.resolve(name, resolutionStack);
    }
    
    throw new Error(`no registration`);
  };
}

// Example classes for testing
class Logger {
  constructor() {
    this.logs = [];
  }

  log(message) {
    this.logs.push(message);
  }

  getLogs() {
    return [...this.logs];
  }
}

class Database {
  constructor(logger) {
    this.logger = logger;
    this.connected = false;
  }

  connect() {
    this.logger.log("Database connected");
    this.connected = true;
  }

  query(sql) {
    this.logger.log(`Query: ${sql}`);
    return [];
  }
}

class UserRepository {
  constructor(database, logger) {
    this.database = database;
    this.logger = logger;
  }

  findById(id) {
    this.logger.log(`Finding user ${id}`);
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

class UserService {
  constructor(userRepository, logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  getUser(id) {
    this.logger.log(`Getting user ${id}`);
    return this.userRepository.findById(id);
  }
}

module.exports = {
  Container,
  createChildContainer,
  Logger,
  Database,
  UserRepository,
  UserService,
};
