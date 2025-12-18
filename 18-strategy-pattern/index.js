/**
 * Strategy Pattern Implementation
 */

// ============================================
// SORTING STRATEGIES
// ============================================

/**
 * Sort Context
 *
 * Delegates sorting to a strategy.
 */
class SortContext {
  constructor(strategy) {
    // TODO: Store strategy
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    // TODO: Update strategy
    this.strategy = strategy;
  }

  sort(array) {
    // TODO: Delegate to strategy
    // Return sorted copy, don't mutate original
    if(!this.strategy){
      throw new Error('no strategy');
    }

    return this.strategy.sort([...array]);
  }
}

/**
 * Bubble Sort Strategy
 */
class BubbleSort {
  sort(array) {
    // TODO: Implement bubble sort
    // Return new sorted array
    const arr = [...array];
    const n = arr.length;
    
    for(let i = 0; i < n - 1; i++){
      for(let j = 0; j < n - i - 1; j++){
        if(arr[j] > arr[j + 1]){
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    
    return arr;
  }
}

/**
 * Quick Sort Strategy
 */
class QuickSort {
  sort(array) {
    // TODO: Implement quick sort
    // Return new sorted array

    const arr = [...array];
    
    if(arr.length <= 1){
      return arr;
    }
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];
    
    for(const element of arr){
      if(element < pivot){
        left.push(element);
      }
      else if (element > pivot){
        right.push(element);
      }
      else{
        equal.push(element);
      }
    }
    
    return [...this.sort(left), ...equal, ...this.sort(right)];
  }
}

/**
 * Merge Sort Strategy
 */
class MergeSort {
  sort(array) {
    // TODO: Implement merge sort
    // Return new sorted array

    const arr = [...array];
    
    if(arr.length <= 1){
      return arr;
    }
    
    const mid = Math.floor(arr.length / 2);
    const left = this.sort(arr.slice(0, mid));
    const right = this.sort(arr.slice(mid));
    
    return this.merge(left, right);
  }

  merge(left, right){
    const result = [];
    let i = 0, j = 0;
    
    while(i < left.length && j < right.length){
      if(left[i] < right[j]){
        result.push(left[i]);
        i++;
      }
      else{
        result.push(right[j]);
        j++;
      }
    }
    
    return [...result, ...left.slice(i), ...right.slice(j)];
  }
}

// ============================================
// PRICING STRATEGIES
// ============================================

/**
 * Pricing Context
 *
 * Calculates prices using a strategy.
 */
class PricingContext {
  constructor(strategy) {
    // TODO: Store strategy
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    // TODO: Update strategy
    this.strategy = strategy;
  }

  calculateTotal(items) {
    // TODO: Delegate to strategy
    if(!this.strategy){
      throw new Error('no strategy');
    }
    return this.strategy.calculate(items);
  }
}

/**
 * Regular Pricing (no discount)
 */
class RegularPricing {
  calculate(items) {
    // TODO: Sum all item prices
    return items.reduce((total, item) => total + item.price, 0);
  }
}

/**
 * Percentage Discount
 */
class PercentageDiscount {
  constructor(percentage) {
    // TODO: Store percentage (0-100)
    this.percentage = Math.max(0, Math.min(100, percentage));
  }

  calculate(items) {
    // TODO: Apply percentage discount
    // total * (1 - percentage/100)
    const subtotal = items.reduce((total, item) => total + item.price, 0);
    const discount = subtotal * (this.percentage / 100);
    return Math.max(0, subtotal - discount);
  }
}

/**
 * Fixed Discount
 */
class FixedDiscount {
  constructor(amount) {
    // TODO: Store fixed discount amount
    this.amount = Math.max(0, amount);
  }

  calculate(items) {
    // TODO: Subtract fixed amount from total
    // Don't go below 0
    const subtotal = items.reduce((total, item) => total + item.price, 0);
    return Math.max(0, subtotal - this.amount);
  }
}

/**
 * Buy One Get One Free
 */
class BuyOneGetOneFree {
  calculate(items) {
    // TODO: Every second item is free
    // Sort by price desc, charge only every other item

    const sortedItems = [...items].sort((a, b) => b.price - a.price);
    
    let total = 0;
    for(let i = 0; i < sortedItems.length; i++){
      if(i % 2 === 0){
        total += sortedItems[i].price;
      }
    }
    
    return total;
  }
}

/**
 * Tiered Discount
 *
 * Different discount based on total.
 */
class TieredDiscount {
  constructor(tiers) {
    // TODO: Store tiers
    // tiers = [{ threshold: 100, discount: 10 }, { threshold: 200, discount: 20 }]
    // this.tiers = tiers;
    this.tiers = [...tiers].sort((a, b) => a.threshold - b.threshold);
  }

  calculate(items) {
    // TODO: Apply tier discount based on subtotal
    const subtotal = items.reduce((total, item) => total + item.price, 0);
    
    let applicableTier = null;
    for(const tier of this.tiers){
      if(subtotal >= tier.threshold){
        applicableTier = tier;
      }
    }
    
    if(applicableTier){
      const discount = subtotal * (applicableTier.discount / 100);
      return subtotal - discount;
    }
    
    return subtotal;
  }
}

// ============================================
// VALIDATION STRATEGIES
// ============================================

/**
 * Validation Context
 */
class ValidationContext {
  constructor(strategy) {
    // TODO: Store strategy
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    // TODO: Update strategy
    this.strategy = strategy;
  }

  validate(data) {
    // TODO: Delegate to strategy

    if(!this.strategy){
      throw new Error('no strategy');
    }
    return this.strategy.validate(data);
  }
}

/**
 * Strict Validation
 */
class StrictValidation {
  validate(data) {
    // TODO: Strict rules - all fields required, strict format
    // Return { valid: boolean, errors: string[] }

    const errors = [];

    if(!data.name){
      errors.push('name is required');
    }
    else if (typeof data.name !== 'string'){
      errors.push('name must be a string');
    }

    if(!data.email){
      errors.push('email is required');
    }
    else if(typeof data.email !== 'string'){
      errors.push('email must be a string');
    }
    else if(!data.email.includes('@')){
      errors.push('email must be a valid email address');
    }

    if(data.age === undefined || data.age === null){
      errors.push('age is required');
    }
    else if(typeof data.age !== 'string' && typeof data.age !== 'number'){
      errors.push('age must be a string or number');
    }
    else{
      const ageNum = Number(data.age);
      if(isNaN(ageNum) || ageNum < 0){
        errors.push('age must be a valid positive number');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * Lenient Validation
 */
class LenientValidation {
  validate(data) {
    // TODO: Lenient rules - only critical fields required

    const errors = [];

    if(data.name !== undefined && typeof data.name !== 'string'){
      errors.push('name must be a string if provided');
    }

    if(data.email !== undefined){
      if(typeof data.email !== 'string'){
        errors.push('email must be a string if provided');
      }
      else if(!data.email.includes('@')){
        errors.push('email must be a valid email address if provided');
      }
    }

    if(data.age !== undefined && data.age !== null){
      if(typeof data.age !== 'string' && typeof data.age !== 'number'){
        errors.push('age must be a string or number if provided');
      }
      else{
        const ageNum = Number(data.age);
        if(isNaN(ageNum) || ageNum < 0){
          errors.push('age must be a valid positive number if provided');
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// ============================================
// STRATEGY REGISTRY
// ============================================

/**
 * Strategy Registry
 *
 * Register and retrieve strategies by name.
 */
class StrategyRegistry {
  constructor() {
    // TODO: Initialize registry map
    this.strategies = new Map();
  }

  register(name, strategy) {
    // TODO: Store strategy by name

    if(!name || typeof name !== 'string'){
      throw new Error('no string');
    }

    if(typeof strategy !== 'object' || strategy === null){
      throw new Error('strategy not object');
    }
    
    this.strategies.set(name, strategy);
    return this;
  }

  get(name) {
    // TODO: Return strategy by name
    if(!this.strategies.has(name)){
      return null;
    }
    return this.strategies.get(name);
  }

  has(name) {
    // TODO: Check if strategy exists
    return this.strategies.has(name);
  }
}

module.exports = {
  // Sorting
  SortContext,
  BubbleSort,
  QuickSort,
  MergeSort,
  // Pricing
  PricingContext,
  RegularPricing,
  PercentageDiscount,
  FixedDiscount,
  BuyOneGetOneFree,
  TieredDiscount,
  // Validation
  ValidationContext,
  StrictValidation,
  LenientValidation,
  // Registry
  StrategyRegistry,
};
