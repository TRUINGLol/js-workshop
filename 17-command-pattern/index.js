/**
 * Command Pattern Implementation
 */

/**
 * Command Manager
 *
 * Manages command execution with undo/redo support.
 */
class CommandManager {
  constructor() {
    // TODO: Initialize stacks
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Execute a command
   * @param {Object} command - Command with execute() method
   */
  execute(command) {
    // TODO: Implement execute
    // Step 1: Call command.execute()
    command.execute();

    // Step 2: Push to undo stack
    this.undoStack.push(command);

    // Step 3: Clear redo stack (new action invalidates redo history)
    this.redoStack.length = 0;
  }

  /**
   * Undo the last command
   * @returns {boolean} Whether undo was performed
   */
  undo() {
    // TODO: Implement undo

    // Step 1: Check if undo stack is empty
    if(this.undoStack.length === 0){
      return false;
    }

    // Step 2: Pop command from undo stack
    const command = this.undoStack.pop();

    // Step 3: Call command.undo()
    command.undo();

    // Step 4: Push to redo stack
    this.redoStack.push(command);

    // Step 5: Return true
    return true;
  }

  /**
   * Redo the last undone command
   * @returns {boolean} Whether redo was performed
   */
  redo() {
    // TODO: Implement redo

    // Step 1: Check if redo stack is empty
    if(this.redoStack.length === 0){
      return false;
    }

    // Step 2: Pop command from redo stack
    const command = this.redoStack.pop();

    // Step 3: Call command.execute()
    command.execute();

    // Step 4: Push to undo stack
    this.undoStack.push(command);

    // Step 5: Return true
    return true;
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    // TODO: Return whether undo stack has items
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    // TODO: Return whether redo stack has items
    return this.redoStack.length > 0;
  }

  /**
   * Get command history (executed commands)
   * @returns {Object[]}
   */
  get history() {
    // TODO: Return copy of undo stack
    return [...this.undoStack];
  }

  /**
   * Clear all history
   */
  clear() {
    // TODO: Clear both stacks
    this.undoStack.length = 0;
    this.redoStack.length = 0;
  }
}

/**
 * Add Command
 */
class AddCommand {
  constructor(calculator, value) {
    // TODO: Store calculator and value
    this.calculator = calculator;
    this.value = value;
    this.description = `Add ${value}`;
  }

  execute() {
    // TODO: Add value to calculator.value
    this.calculator.value += this.value;
  }

  undo() {
    // TODO: Subtract value from calculator.value
    this.calculator.value -= this.value;
  }
}

/**
 * Subtract Command
 */
class SubtractCommand {
  constructor(calculator, value) {
    // TODO: Store calculator and value
    this.calculator = calculator;
    this.value = value;
    this.description = `Subtract ${value}`;
  }

  execute() {
    // TODO: Subtract value from calculator.value
    this.calculator.value -= this.value;
  }

  undo() {
    // TODO: Add value to calculator.value
    this.calculator.value += this.value;
  }
}

/**
 * Multiply Command
 */
class MultiplyCommand {
  constructor(calculator, value) {
    // TODO: Store calculator, value, and previous value for undo
    this.calculator = calculator;
    this.value = value;
    this.previousValue = null;
    this.description = `Multiply by ${value}`;
  }

  execute() {
    // TODO: Multiply calculator.value by value
    // Save previous value for undo
    this.previousValue = this.calculator.value;
    this.calculator.value *= this.value;
  }

  undo() {
    // TODO: Restore previous value
    if(this.previousValue !== null){
      this.calculator.value = this.previousValue;
    }
  }
}

/**
 * Divide Command
 */
class DivideCommand {
  constructor(calculator, value) {
    // TODO: Store calculator, value, and previous value for undo
    this.calculator = calculator;
    this.value = value;
    this.previousValue = null;
    this.description = `Divide by ${value}`;
  }

  execute() {
    // TODO: Divide calculator.value by value
    // Save previous value for undo
    if(this.value === 0){
      throw new Error("cannot divide by zero");
    }

    this.previousValue = this.calculator.value;

    this.calculator.value /= this.value;
  }

  undo() {
    // TODO: Restore previous value
    if(this.previousValue !== null){
      this.calculator.value = this.previousValue;
    }
  }
}

/**
 * Macro Command (Composite)
 *
 * Groups multiple commands into one.
 */
class MacroCommand {
  constructor(commands = []) {
    // TODO: Store commands array
    this.commands = commands;
    this.description = "Macro";
  }

  /**
   * Add a command to the macro
   * @param {Object} command
   */
  add(command) {
    // TODO: Add command to array
    this.commands.push(command);
    this.description = `macro (${this.commands.map(c => c.description).join(", ")})`;
  }

  execute() {
    // TODO: Execute all commands in order
    for(const command of this.commands){
      command.execute();
    }
  }

  undo() {
    // TODO: Undo all commands in reverse order
    for(let i = this.commands.length - 1; i >= 0; i--){
      this.commands[i].undo();
    }
  }
}

/**
 * Set Value Command
 *
 * Sets calculator to specific value (useful for testing).
 */
class SetValueCommand {
  constructor(calculator, value) {
    // TODO: Store calculator, new value, and previous value
    this.calculator = calculator;
    this.newValue = value;
    this.previousValue = null;
    this.description = `Set to ${value}`;
  }

  execute() {
    // TODO: Save previous, set new value
    this.previousValue = this.calculator.value;
    this.calculator.value = this.newValue;
  }

  undo() {
    // TODO: Restore previous value
    if(this.previousValue !== null){
      this.calculator.value = this.previousValue;
    }
  }
}

module.exports = {
  CommandManager,
  AddCommand,
  SubtractCommand,
  MultiplyCommand,
  DivideCommand,
  MacroCommand,
  SetValueCommand,
};
