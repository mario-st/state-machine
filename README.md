# state-machine
A very simple finite state machine

## Class structure

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| coming | soon       |        |             |

## Sending Arguments with state

## Synchronous transitions

The machine will immediately execute the transition.

```
var sm = new StateMachine("myStateMachine");

sm.add("a", "b", function (from, to, args, done) {
	return "hello, world!";
});

sm.toState("a");
sm.toState("b");
```

## Asynchronous transitions

The machine will lock the internal thread until the asynchronous transition is done.

```
var sm = new StateMachine("myStateMachine");

sm.add("a", "b", function (from, to, args, done) {
	setTimeout(function() {
		done("hello, world!");
	}, 500);
});

sm.toState("a");
sm.toState("b");
```