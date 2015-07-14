# state-machine

A state machine with asynchronous and synchronous transitions.

## class StateMachine

### constructor(name:string[, stateLimit:number[, loggingEnabled:boolean]])

initializes the state machine.

| Arguments       | Type    | Description                                            |
| --------------- | ------- | ------------------------------------------------------ |
| name            | string  | the name of the state machine (useful for logging)     |
| stateLimit      | number  | (optional) the limit of the state history (default: 5) |
| loggingEnabled  | boolean | (optional) enables/disables logging                    |

### ::add(from:any, to:any, onStart:function[, onExit:function])

adds a transition to the machine.

| Arguments | Type            | Description                                    |
| --------- | --------------- | ---------------------------------------------- |
| from      | any             | the current state                              |
| to        | any             | the next state                                 |
| onStart   | function or any | the transition start callback                  |
| onExit    | function        | (optional) called at the end of the transition |

### ::to(state:any[, args:any])

changes the state to the new given state. Optionally you can add
some additional information to the state as last parameter.

| Arguments | Type            | Description                                    |
| --------- | --------------- | ---------------------------------------------- |
| state     | any             | the new state to change                        |
| args      | any             | (optional) additional information to the state |

### ::setLogLevel(level:number)

enables/disables logging

| Arguments | Type            | Description                                    |
| --------- | --------------- | ---------------------------------------------- |
| level     | number          | defines the log level (default: 1)             |

## Sending Arguments with state

## Synchronous transitions

The machine will immediately execute the transition.

```javascript
var sm = new StateMachine("sync");

sm.add("a", "b", function onStart(from, to, args) {
	return "hello, world!";
}, function onExit(from, to, args) {
	this.log(1, args);
});

sm.to("a");
sm.to("b");
```

## Asynchronous transitions

The machine will lock the internal thread until the asynchronous transition is done.

```javascript
var sm = new StateMachine("async");

sm.add("a", "b", function onStart(from, to, args, done) {
	setTimeout(function() {
		done("hello, world!");
	}, 500);
}, function onExit(from, to, args) {
	this.log(1, args);
});

sm.to("a");
sm.to("b");
```