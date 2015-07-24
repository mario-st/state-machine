!function (global) {

  if (typeof exports === "undefined") {
    exports = typeof window === "object" ? window : typeof self === "object" ? self : {};
  }

var undef,
  states = 'states',
  lastState = 'lastState',
  transitions = 'transitions',
  len = 'length',
  push = 'push',
  call = 'call',
  splice = 'splice',
  fromStr = 'from',
  toStr = 'to',
  argsStr = 'args',
  wildcard = '*',
  className = 'StateMachine';

/**
 * @class StateMachine
 * @constructs
 * @param {number} [stateLimit=5] the limitation of the state history
 * @param {boolean} [strict=false] this mode forces you to use the right transition order
 */
exports[className] = function (stateLimit, strict) {
  var me = this,
    locked = false,
    current = {},
    stateIndex = 0,
    FROM = 0, TO = 1, ON_START = 2, ON_EXIT = 3;

  me.name = className;
  stateLimit = typeof stateLimit === "number" ? stateLimit : 5;

  me[states] = [];
  me[lastState] = null;
  me[transitions] = [];

  // enables/disables strict transitions
  // if enabled: unregistered transitions will throw an exception
  me.setStrict = function (enabled) {
    strict = enabled;
    return this;
  };

  // adds a new transition
  me.add = function (from, to, onStart, onExit) {
    var context = [from, to, onStart, onExit];
    me[transitions][push](context);
    return context;
  };

  // removes a transition from context
  me.remove = function (context) {
    var transitionArray = me[transitions];
    for (var i = 0, l = transitionArray[len]; i < l; i++) {
      if (transitionArray[i] === context) {
        transitionArray[splice](i, 1);
        break;
      }
    }
    return this;
  };

  // change state and trigger a new transition
  me.to = function (state, args, onReady) {
    if (locked) {
      return this;
    }

    var isValid = false,
      history = me[states],
      transitionObj = me[transitions],
      i = 0, l, ptr, fromState, toState;

    if (strict) {
      // check for a valid transition
      for (l = transitionObj[len]; i < l; i++) {
        isValid = transitionObj[i][FROM] === me[lastState] && transitionObj[i][TO] === state;
        if (isValid) {
          break;
        }
      }

      // no transition found, no valid transition existing.
      if (!isValid) {
        throw new Error("The transition is invalid.");
      }
    }

    history[push](state);

    ptr = (history[len] - stateLimit - 2) + stateLimit;
    fromState = history[ptr] || null;
    toState = history[ptr + 1];

    history[splice](0, history[len] - stateLimit);
    stateIndex = 0;

    /**
     * @private
     * @param {*} [args=undefined]
     */
    var changeState = function (args) {
      var transition = transitionObj[stateIndex],
        index = stateIndex,
        sync = false, next;

      if (transition && (transition[FROM] === fromState || transition[FROM] === wildcard) && (transition[TO] === toState || transition[TO] === wildcard)) {

        // asynchronous response
        next = function (args) {
          locked = false;

          me[lastState] = toState;

          if (transition[ON_EXIT]) {
            transition[ON_EXIT][call](me, fromState, toState, args);
          }
          if (onReady) {
            onReady[call](me, fromState, toState, args);
          }

          if (index === stateIndex && ++stateIndex < transitionObj[len]) {
            changeState(args);
          }
        };

        current[fromStr] = fromState;
        current[toStr] = toState;
        current[argsStr] = args;

        // five possibilities:
        // 1. it is a function with synchronous response (returns a value different to undefined)
        // 2. it is a function with asynchronous response (calls the next() callback and returns undefined)
        if ("function" === typeof transition[ON_START]) {
          args = transition[ON_START][call](me, fromState, toState, args, next);
        }
        // 3. it is not a function and the transition is the response
        else if (null !== transition[ON_START]) {
          args = transition[ON_START];
        }
        // 4. no transition executed and args is not defined
        else if (undef === args) {
          args = null;
        }
        // 5. any arguments which are not undefined will be piped

        // synchronous response
        if (undef !== args) {
          sync = true;
          next(args);
        }

        // locking any new state until the transition is complete
        if (!sync) {
          locked = true;
        }
      }
      else if (index === stateIndex && ++stateIndex < transitionObj[len]) {
        changeState(args);
      }
    };

    changeState(args);
    return this;
  };
};

  var typed = { "function": true, "object": true };

  // AMD
  if (typed[typeof define] && typed[typeof define.amd] && define.amd) {
    define(function () {
      return exports[className];
    });
  }

  // Browser / Rhino
  else {
    global[className] = exports[className];
  }

}(this);