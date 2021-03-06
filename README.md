# state-machine

[![travis-ci.org](https://travis-ci.org/mario-st/state-machine.svg?branch=master)](https://travis-ci.org/mario-st/state-machine?branch=master)
[![Dependency Status](https://david-dm.org/mario-st/state-machine.svg)](https://david-dm.org/mario-st/state-machine)
[![devDependency Status](https://david-dm.org/mario-st/state-machine/dev-status.svg)](https://david-dm.org/mario-st/state-machine#info=devDependencies)

A state machine with asynchronous and synchronous transitions.

## class StateMachine

### constructor([stateLimit:number], [strict:boolean])

initializes the state machine.

| Arguments       | Type    | Description                                                                                       |
| --------------- | ------- | ------------------------------------------------------------------------------------------------- |
| stateLimit      | number  | (optional) the limit of the state history (default: 5)                                            |
| strict          | boolean | (optional) enables/disables strict transitions / unregistered transitions will throw an exception |

### add(from:any, to:any, onStart:function, [onExit:function]):Array

adds a transition to the machine.

| Arguments | Type            | Description                                    |
| --------- | --------------- | ---------------------------------------------- |
| from      | any             | the current state                              |
| to        | any             | the next state                                 |
| onStart   | function or any | the transition start callback                  |
| onExit    | function        | (optional) called at the end of the transition |

Returns the transition context array: [from, to, onStart, onExit]

### setStrict(enabled:boolean):this

removes a transition from the machine. It must be
exactly the context of a transition.

| Arguments | Type            | Description                                    																				 |
| --------- | --------------- | -------------------------------------------------------------------------------------- |
| enabled   | boolean         | enables/disables strict transitions / unregistered transitions will throw an exception |

### remove(context:Array):this

removes a transition from the machine. It must be
exactly the context of a transition.

| Arguments | Type            | Description                                    |
| --------- | --------------- | ---------------------------------------------- |
| context   | Array           | the context reference returned by #add()       |

### to(state:any, [args:any], [onReady:function]):this

changes the state to the new given state. Optionally you can add
some additional information to the state as last parameter.

| Arguments | Type            | Description                                                  |
| --------- | --------------- | ------------------------------------------------------------ |
| state     | any             | the new state to change                                      |
| args      | any             | (optional) additional information to the state               |
| onReady   | function        | (optional) will be triggered after every matching transition |

## Require in NodeJS

```javascript
var StateMachine = require("state-machine").StateMachine;

var sm = new StateMachine();
// etc. ...
```

## Load in Browser

```html
<script src="path/to/go/state-machine.js"></script>
<script>
var sm = new StateMachine();
// etc. ...
</script>
```

## Synchronous transitions

The machine will immediately execute the transition.

```javascript
var sm = new StateMachine("sync");

sm.add("a", "b", function onStart(from, to, args) {
	return "hello, world!";
}, function onExit(from, to, args) {
	console.log("onExit:", args);
});

sm.to("a");
sm.to("b");
```

## Asynchronous transitions

The machine will lock the internal thread until the asynchronous transition is done.

```javascript
var sm = new StateMachine();

sm.add("a", "b", function onStart(from, to, args, done) {
	setTimeout(function() {
		done("hello, world!");
	}, 500);
}, function onExit(from, to, args) {
	console.log("onExit:", args);
});

sm.to("a");
sm.to("b");
```

## Chaining

```javascript
var sm = new StateMachine();

// add can't be chained
bcContext = sm.add("b", "c", function () { console.log("hello, universe!"); return 1;});

sm.to("a").to("b").to("c").remove(bcContext);
```

## Browser/NodeJS?

Should work on any modern and old browsers, in NodeJS and probably in io.js.

## Some plans?

* I haven't a good name for the library, yet. There are plenty state-machines on NPM \*sigh*.
* I should reconsider the locking mechanism and the chaining thing.

Feel free to fork, make pull-requests and write some issues if you like.