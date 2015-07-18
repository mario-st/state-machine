describe("StateMachine", function () {
  var StateMachine;
  before(function () {
    StateMachine = exports.StateMachine;
  });

  describe("constructor", function () {
    it("is an instance of StateMachine", function () {
      var sm = new StateMachine("sm");
      sm.should.be.instanceOf(StateMachine);
    });

    it("holds 5 states by default", function () {
      var sm = new StateMachine("sm");
      for (var i = 0, l = 6; i < l; i++) {
        sm.to(i);
      }
      sm.states.length.should.be.eql(5);
      sm.states[0].should.be.eql(1);
      sm.states[4].should.be.eql(5);
    });

    it("holds the given state limit", function () {
      var sm = new StateMachine("sm", 3);
      for (var i = 0, l = 6; i < l; i++) {
        sm.to(i);
      }
      sm.states.length.should.be.eql(3);
      sm.states[0].should.be.eql(3);
      sm.states[2].should.be.eql(5);
    });
  });

  describe("#async", function () {

    describe("::add", function () {
      it("accept string states", function () {
        var sm = new StateMachine("sm");
        sm.add("a", "b", function (from, to, args, next) {
          setTimeout(function () {
            from.should.be.eql("a");
            to.should.be.eql("b");
            next();
          }, 0);
        });
        sm.to("a");
        sm.to("b");
      });

      it("accept anything as a state", function () {
        var stateA = null, stateB = false, stateC = undefined,
          stateD = {}, stateE = [], stateF = Math.PI;
        var sm = new StateMachine("sm");

        sm.add(stateA, stateB, function (from, to, args, next) {
          setTimeout(function () {
            should.assert(from === stateA);
            should.assert(to === stateB);
            next();
          }, 0);
        });

        sm.add(stateC, stateD, function (from, to, args, next) {
          setTimeout(function () {
            should.assert(from === stateC);
            should.assert(to === stateD);
            next();
          }, 0);
        });

        sm.add(stateE, stateF, function (from, to, args, next) {
          setTimeout(function () {
            should.assert(from === stateE);
            should.assert(to === stateF);
            next();
          }, 0);
        });

        // initial state is always null. Let's prove it!
        //sm.to(stateA);
        var queue = [stateB, stateC, stateD, stateE, stateF];

        function createNext() {
          if (queue.length) {
            return function () {
              sm.to(queue.shift(), null, createNext());
            };
          }
          return function () {
            should.assert(sm.states[0] === stateB);
            should.assert(sm.states[1] === stateC);
            should.assert(sm.states[2] === stateD);
            should.assert(sm.states[3] === stateE);
            should.assert(sm.states[4] === stateF);
          };
        }

        sm.to(queue.shift(), null, createNext());
      });

      it("uses anything except null or function as a static argument", function () {
        var sm = new StateMachine("sm");
        sm.add(null, "a", "hello, world!", function onExit(from, to, str) {
          str.should.be.eql("hello, world!");
        });
        sm.to("a");
      });
    });

    describe("::remove", function () {

      it("remove transition reference", function () {
        var sm = new StateMachine("sm");

        var onStart = function () {
          return 1;
        };
        var onExit = function (from, to, args) {
          args.should.be.eql(1);
        };

        var context = sm.add(null, "a", onStart, onExit);
        should.assert(context[0] === null);
        should.assert(context[1] === "a");
        should.assert(context[2] === onStart);
        should.assert(context[3] === onExit);
        should.assert(sm.to("a") === sm);
        should.assert(sm.remove(context) === sm);
        sm.transitions.length.should.be.eql(0);
      });

      it("does not remove transition copy", function () {
        var sm = new StateMachine("sm");

        var onStart = function () {
          return 1;
        };
        var onExit = function (from, to, args) {
          args.should.be.eql(1);
        };

        var context = sm.add(null, "a", onStart, onExit);
        should.assert(context[0] === null);
        should.assert(context[1] === "a");
        should.assert(context[2] === onStart);
        should.assert(context[3] === onExit);
        should.assert(sm.to("a") === sm);
        should.assert(sm.remove(context.slice(0)) === sm);
        sm.transitions.length.should.be.eql(1);
      });

    });

    describe("::to", function () {

      it("append arguments", function () {
        var sm = new StateMachine("sm");
        sm.add("a", "b", null, function onExit(from, to, args) {
          from.should.be.eql("a");
          to.should.be.eql("b");
          args.hello.should.be.eql("world");
        });

        sm.to("a");
        sm.to("b", { hello: "world" });
      });

      it("accepts wildcards", function () {
        var sm = new StateMachine("sm"), i = 0;
        sm.add("*", "a", function () {
          return i++;
        }, function (from, to, index) {
          index.should.be.below(4);
        });
        sm.add("b", "*", function () {
          return true;
        }, function (from, to, args) {
          args.should.be.ok;
        });
        sm.to("a");
        sm.to("b");
        sm.to("a");
        sm.to("a");
      });

      it("locks on asynchronous transition", function (done) {
        var sm = new StateMachine("sm");
        sm.add(null, "a", function (from, to, args, next) {
          setTimeout(function () {
            next();
          }, 50);
        }, function (from, to, args) {
          should.assert(args === undefined, "this must be called.");
          sm.states[0].should.be.eql(to);
          done();
        });
        sm.add("a", "b", function () {
          should.assert(false, "this must not be called!");
        });

        sm.to("a");
        sm.to("b");
      });

    });

  });

  describe("#sync", function () {

    describe("::add", function () {
      it("accept string states", function () {
        var sm = new StateMachine("sm");
        sm.add("a", "b", function (from, to) {
          from.should.be.eql("a");
          to.should.be.eql("b");
          return 1;
        });
        sm.to("a");
        sm.to("b");
      });

      it("accept anything as a state", function () {
        var stateA = null, stateB = false, stateC = undefined,
          stateD = {}, stateE = [], stateF = Math.PI;
        var sm = new StateMachine("sm");

        sm.add(stateA, stateB, function (from, to) {
          should.assert(from === stateA);
          should.assert(to === stateB);
          return 1;
        });

        sm.add(stateC, stateD, function (from, to) {
          should.assert(from === stateC);
          should.assert(to === stateD);
          return 1;
        });

        sm.add(stateE, stateF, function (from, to) {
          should.assert(from === stateE);
          should.assert(to === stateF);
          return 1;
        });

        // initial state is always null. Let's prove it!
        //sm.to(stateA);
        sm.to(stateB);
        sm.to(stateC);
        sm.to(stateD);
        sm.to(stateE);
        sm.to(stateF);
      });

      it("uses anything except null or function as a static argument", function () {
        var sm = new StateMachine("sm");
        sm.add(null, "a", "hello, world!", function onExit(from, to, str) {
          str.should.be.eql("hello, world!");
        });
        sm.to("a");
      });

    });

    describe("::remove", function () {

      it("remove transitions", function () {
        var sm = new StateMachine("sm");

        var onStart = function () {
          return 1;
        };
        var onExit = function (from, to, args) {
          args.should.be.eql(1);
        };

        var context = sm.add(null, "a", onStart, onExit);
        should.assert(context[0] === null);
        should.assert(context[1] === "a");
        should.assert(context[2] === onStart);
        should.assert(context[3] === onExit);
        should.assert(sm.to("a") === sm);
        should.assert(sm.remove(context) === sm);
        sm.transitions.length.should.be.eql(0);
      });

    });

    describe("::to", function () {

      it("append arguments", function () {
        var sm = new StateMachine("sm");
        sm.add("a", "b", null, function onExit(from, to, args) {
          from.should.be.eql("a");
          to.should.be.eql("b");
          args.hello.should.be.eql("world");
        });

        sm.to("a");
        sm.to("b", { hello: "world" });
      });

      it("accepts wildcards", function () {
        var sm = new StateMachine("sm"), i = 0;
        sm.add("*", "a", function () {
          return i++;
        }, function (from, to, index) {
          index.should.be.below(4);
        });
        sm.add("b", "*", function () {
          return true;
        }, function (from, to, args) {
          args.should.be.ok;
        });
        sm.to("a");
        sm.to("b");
        sm.to("a");
        sm.to("a");
      });

      it("has no transition start", function () {
        var sm = new StateMachine("sm");
        sm.add(null, "a", null, function onExit(from, to, args) {
          should.assert(args === null);
        });
        sm.to("a");
      });

    });

  });

});