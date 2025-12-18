/**
 * Factory Pattern Implementation
 */

// Example shape classes for the factory
class Circle {
  constructor({ radius }) {
    this.radius = radius;
    this.type = "circle";
  }

  area() {
    return Math.PI * this.radius ** 2;
  }

  perimeter() {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.type = "rectangle";
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * (this.width + this.height);
  }
}

class Triangle {
  constructor({
    base,
    height,
    sides = [base, height, Math.sqrt(base ** 2 + height ** 2)],
  }) {
    this.base = base;
    this.height = height;
    this.sides = sides;
    this.type = "triangle";
  }

  area() {
    return (this.base * this.height) / 2;
  }

  perimeter() {
    return this.sides.reduce((sum, side) => sum + side, 0);
  }
}

/**
 * Simple Shape Factory
 *
 * A factory object that creates shapes based on type.
 */
const ShapeFactory = {
  // TODO: Implement create method

  /**
   * Create a shape instance
   * @param {string} type - Shape type ('circle', 'rectangle', 'triangle')
   * @param {Object} options - Shape options
   * @returns {Object} Shape instance
   */
  create(type, options) {
    // TODO: Implement factory logic
    switch(type.toLowerCase()){
      case 'circle':
        if(!options.radius){
          throw new Error('radius required');
        }
        return new Circle(options);
      
      case 'rectangle':
        if(!options.width || !options.height){
          throw new Error('width and height required');
        }
        return new Rectangle(options);
      
      case 'triangle':
        if(!options.base || !options.height){
          throw new Error('base and height required');
        }
        return new Triangle(options);

      default:
        throw new Error('unknown type');
    }

    // Use switch or object lookup to create the right shape
    // Throw error for unknown types
  },
};

/**
 * Registration Factory
 *
 * A factory class where types can be registered dynamically.
 */
class Factory {
  constructor() {
    // TODO: Initialize registry
    // this.registry = new Map();
    this.registry = new Map();
  }

  /**
   * Register a type with the factory
   * @param {string} type - Type name
   * @param {Function} Class - Constructor function
   * @param {Object} [options] - Registration options
   * @param {string[]} [options.required] - Required argument keys
   * @param {Function} [options.validate] - Validation function
   */
  register(type, Class, options = {}) {
    // TODO: Implement register
    // Store the class and options in the registry
    if(typeof Class !== 'function'){
      throw new Error('must be a constructor function');
    }

    this.registry.set(type, { Class, options });
    return this;
  }

  /**
   * Unregister a type
   * @param {string} type - Type name
   * @returns {boolean} true if type was registered
   */
  unregister(type) {
    // TODO: Implement unregister
    return this.registry.delete(type);
  }

  /**
   * Create an instance of a registered type
   * @param {string} type - Type name
   * @param {Object} args - Constructor arguments
   * @returns {Object} Instance of the type
   */
  create(type, args = {}) {
    // TODO: Implement create

    // Step 1: Check if type is registered
    if(!this.registry.has(type)){
      throw new Error('not registered');
    }

    // Step 2: Get the class and options
    const {Class, options} = this.registry.get(type);

    // Step 3: Validate required fields (if specified)
    if(options.required){
      for(const field of options.required){
        if(!(field in args)){
          throw new Error('Missing field');
        }
      }
    }

    // Step 4: Run custom validation (if specified)
    if(options.validate && typeof options.validate === 'function'){
      const validationResult = options.validate(args);
      if(validationResult !== true){
        throw new Error('Validation failed');
      }
    }

    // Step 5: Create and return instance
    try{
      return new Class(args);
    }
    catch(error){
      throw new Error('failed to create instance');
    }
  }

  /**
   * Check if a type is registered
   * @param {string} type - Type name
   * @returns {boolean}
   */
  has(type) {
    // TODO: Implement has
    return this.registry.has(type);
  }

  /**
   * Get all registered type names
   * @returns {string[]}
   */
  getTypes() {
    // TODO: Implement getTypes
    return Array.from(this.registry.keys());
  }

  /**
   * Clear all registered types
   */
  clear() {
    // TODO: Implement clear
    this.registry.clear();
    return this;
  }
}

/**
 * Example: Logger Factory
 *
 * Practical example of factory for different logger types.
 */
class ConsoleLogger {
  constructor({ prefix = "" } = {}) {
    this.prefix = prefix;
  }

  log(message) {
    console.log(`${this.prefix}${message}`);
  }

  error(message) {
    console.error(`${this.prefix}ERROR: ${message}`);
  }
}

class FileLogger {
  constructor({ path, prefix = "" } = {}) {
    this.path = path;
    this.prefix = prefix;
    this.logs = []; // Simulated file
  }

  log(message) {
    this.logs.push(`${this.prefix}${message}`);
  }

  error(message) {
    this.logs.push(`${this.prefix}ERROR: ${message}`);
  }

  getLogs() {
    return [...this.logs];
  }
}

class JsonLogger {
  constructor({ includeTimestamp = true } = {}) {
    this.includeTimestamp = includeTimestamp;
    this.entries = [];
  }

  log(message) {
    this.entries.push(this._createEntry("info", message));
  }

  error(message) {
    this.entries.push(this._createEntry("error", message));
  }

  _createEntry(level, message) {
    const entry = { level, message };
    if (this.includeTimestamp) {
      entry.timestamp = new Date().toISOString();
    }
    return entry;
  }

  getEntries() {
    return [...this.entries];
  }
}

module.exports = {
  ShapeFactory,
  Factory,
  Circle,
  Rectangle,
  Triangle,
  ConsoleLogger,
  FileLogger,
  JsonLogger,
};
