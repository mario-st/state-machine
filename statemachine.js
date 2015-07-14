/**
 * @class StateMachine
 * @constructor
 * @param {string} name
 * @param {number} [stateLimit=5] the limitation of the state history
 * @param {boolean} [loggingEnabled=false] enables/disables logging
 */
function StateMachine(name, stateLimit, loggingEnabled) {
  var me = this, locked = false, current = {};
  var FROM = 0, TO = 1, ON_START = 2, ON_EXIT = 3;

  stateLimit = stateLimit || 5;
  loggingEnabled = typeof loggingEnabled === "undefined" ? true : loggingEnabled;

  me.states = [];
  me.trns = [];

  var stateIndex = 0;

  /**
   * write into console
   * @param msg
   */
  me.log = function (msg) {
    msg = Array.prototype.slice.call(arguments, 0);
    if (loggingEnabled) {
      console.log.apply(console, [name + "(" + current.from + " -> " + current.to + "):"].concat(msg));
    }
  };

  /**
   * enables/disables logging
   * @param enable
   */
  me.setLogging = function (enable) {
    loggingEnabled = enable;
  };

  /**
   * add a transition
   * @param {string} from
   * @param {string} to
   * @param {*} onStart
   * @param {function} [onExit]
   * @returns {Array} context of the transition
   */
  me.add = function (from, to, onStart, onExit) {
    var context = [from, to, onStart, onExit];
    me.trns.push(context);
    return context;
  };

  /**
   * remove a transition
   * @param {Array} context
   */
  me.remove = function (context) {
    for (var i = me.trns.length - 1; i >= 0; i--) {
      var transition = me.trns[i];
      if (transition === context) {
        me.trns.splice(i, 1);
      }
    }
  };

  /**
   * change to new state
   * @param {string} state
   * @param {*} [args=undefined]
   */
  me.toState = function (state, args) {
    if (locked) {
      return;
    }

    var ptr, from, to, results, states, trns;

    states = me.states;
    trns = me.trns;
    states.push(state);

    ptr = (states.length - stateLimit - 2) + stateLimit;
    from = states[ptr] || null;
    to = states[ptr + 1];
    results = [];

    states.splice(0, states.length - stateLimit);
    stateIndex = 0;

    /**
     * @private
     * @param {*} [args=undefined]
     */
    var changeState = function (args) {
      var transition = trns[stateIndex], index = stateIndex;

      if (transition && (transition[FROM] === from || transition[FROM] === "*") && (transition[TO] === to || transition[TO] === "*")) {
        var sync = false;

        // asynchronous response
        var next = function (args) {
          locked = false;

          me.log("after start");

          if (transition[ON_EXIT]) {
            me.log("before exit", args !== undefined ? args : "");
            transition[ON_EXIT].call(me, from, to, args);
            me.log("after exit");
          }
          if (!sync && index === stateIndex && ++stateIndex < trns.length) {
            changeState(args);
          }
        };

        current.from = from;
        current.to = to;
        current.args = args;

        me.log("before start", args !== undefined ? args : "");

        // five possibilities:
        // 1. it is a function with synchronous response (returns a value different to undefined)
        // 2. it is a function with asynchronous response (calls the next() callback and returns undefined)
        if (typeof transition[ON_START] === "function") {
          args = transition[ON_START].call(me, from, to, args, next);
        }
        // 3. it is not a function and the transition is the response
        else if (transition[ON_START] !== null) {
          args = transition[ON_START];
        }
        // 4. no transition executed and args is not defined
        else if (args === undefined) {
          args = null;
        }
        // 5. any arguments which are not undefined will be piped

        // synchronous response
        if (args !== undefined) {
          sync = true;
          next(args);
        }

        if (!sync) {
          locked = true;
        }
      }
      else if (index === stateIndex && ++stateIndex < trns.length) {
        changeState(args);
      }
    };

    changeState(args);
  };
}

module.exports = StateMachine;
