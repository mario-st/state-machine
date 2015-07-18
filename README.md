# state-machine

A state machine with asynchronous and synchronous transitions.

## class StateMachine

### constructor(name:string, [stateLimit:number], [loggingEnabled:boolean])

initializes the state machine.

| Arguments       | Type    | Description                                            |
| --------------- | ------- | ------------------------------------------------------ |
| name            | string  | the name of the state machine (useful for logging)     |
| stateLimit      | number  | (optional) the limit of the state history (default: 5) |
| loggingEnabled  | boolean | (optional) enables/disables logging                    |

### add(from:any, to:any, onStart:function, [onExit:function]):Array

adds a transition to the machine.

| Arguments | Type            | Description                                    |
| --------- | --------------- | ---------------------------------------------- |
| from      | any             | the current state                              |
| to        | any             | the next state                                 |
| onStart   | function or any | the transition start callback                  |
| onExit    | function        | (optional) called at the end of the transition |

Returns the transition context array: [from, to, onStart, onExit]

### remove(context:Array):StateMachine

removes a transition from the machine. It must be
exactly the context of a transition.

| Arguments | Type            | Description                                    |
| --------- | --------------- | ---------------------------------------------- |
| context   | Array           | the context reference returned by #add()       |

### to(state:any, [args:any, ...]):StateMachine

changes the state to the new given state. Optionally you can add
some additional information to the state as last parameter.

| Arguments | Type            | Description                                           |
| --------- | --------------- | ----------------------------------------------------- |
| state     | any             | the new state to change                               |
| args      | any             | (optional) additional information to the state        |
| onReady   | function        | (optional) will be triggered after transition is done |

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
var sm = new StateMachine("async");

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
var sm = new StateMachine("chained");

// add cannot be chained
bcContext = sm.add("b", "c", function () { console.log("hello, universe!"); return 1;});

sm.to("a").to("b").to("c").remove(bcContext);
```

## Browser/NodeJS?

I'm not sure if it works everywhere and I don't even care much. I think it is safe for every modern browser. It also works well on NodeJS.

## Some plans?

No, not really. Probably I should reconsider the locking mechanism and the chaining thing.
Feel free to fork, make pull-requests and write some issues if you like.