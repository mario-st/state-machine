!function (global) {

  var undef,
    states = 'states',
    transitions = 'transitions',
    len = 'length',
    push = 'push',
    call = 'call',
    splice = 'splice',
    fromStr = 'from',
    toStr = 'to',
    argsStr = 'args',
    wildcard = '*',
    className = 'StateMachine',
    typed = { "function": true, "object": true },
    root = typed[typeof window] && window || typed[typeof self] && self || {};

  /**
   * @class StateMachine
   * @constructor
   * @param {string} name
   * @param {number} [stateLimit=5] the limitation of the state history
   */
  root[className] = function (name, stateLimit) {
    var me = this, locked = false, current = {};
    var FROM = 0, TO = 1, ON_START = 2, ON_EXIT = 3;

    me.name = className;
    stateLimit = stateLimit || 5;

    me[states] = [];
    me[transitions] = [];

    var stateIndex = 0;

    /**
     * add a transition
     * @memberOf StateMachine#
     * @param {*} from
     * @param {*} to
     * @param {*} onStart
     * @param {function} [onExit]
     * @returns {Array} context of the transition
     */
    var add = function (from, to, onStart, onExit) {
      var context = [from, to, onStart, onExit];
      me[transitions][push](context);
      return context;
    };
    me.add = add;

    var remove = function (context) {
      var trns = me[transitions];
      for (var i = 0, l = trns[len]; i < l; i++) {
        if (trns[i] === context) {
          trns[splice](i, 1);
          return;
        }
      }
    };
    me.remove = remove;

    /**
     * change to new state
     * @memberOf StateMachine#
     * @param {*} state
     * @param {*} [args=undefined]
     */
    var to = function (state, args) {
      if (locked) {
        return;
      }

      var ptr, fromState, toState, history, transitionObj;

      history = me[states];
      transitionObj = me[transitions];
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
        var transition = transitionObj[stateIndex], index = stateIndex;

        if (transition && (transition[FROM] === fromState || transition[FROM] === wildcard) && (transition[TO] === toState || transition[TO] === wildcard)) {
          var sync = false;

          // asynchronous response
          var next = function (args) {
            locked = false;
            if (transition[ON_EXIT]) {
              transition[ON_EXIT][call](me, fromState, toState, args);
            }
            if (!sync && index === stateIndex && ++stateIndex < transitionObj[len]) {
              changeState(args);
            }
          };

          current[fromStr] = fromState;
          current[toStr] = toState;
          current[argsStr] = args;

          // five possibilities:
          // 1. it is a function with synchronous response (returns a value different to undefined)
          // 2. it is a function with asynchronous response (calls the next() callback and returns undefined)
          if (typed[typeof transition[ON_START]]) {
            args = transition[ON_START][call](me, fromState, toState, args, next);
          }
          // 3. it is not a function and the transition is the response
          else if (transition[ON_START] !== null) {
            args = transition[ON_START];
          }
          // 4. no transition executed and args is not defined
          else if (args === undef) {
            args = null;
          }
          // 5. any arguments which are not undefined will be piped

          // synchronous response
          if (args !== undef) {
            sync = true;
            next(args);
          }

          if (!sync) {
            locked = true;
          }
        }
        else if (index === stateIndex && ++stateIndex < transitionObj[len]) {
          changeState(args);
        }
      };

      changeState(args);
    };
    me.to = to;
  };

  // AMD
  if (typed[typeof define] && typed[typeof define.amd] && define.amd) {
    define(function () {
      return root[className];
    });
  }

  // Rhino / Node / CommonJS
  else if (typed[typeof exports] && exports) {
    exports[className] = root[className];
  }

  // Browser / Rhino
  else {
    global[className] = root[className];
  }

}(this);