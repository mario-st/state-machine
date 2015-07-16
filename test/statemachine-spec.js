describe("StateMachine", function () {

  describe("constructor", function () {
    it("should be an instance of StateMachine", function () {
      var sm = new StateMachine("sm");
      sm.should.be.instanceOf(StateMachine);
    });

    it("should hold 5 states by default", function () {
      var sm = new StateMachine("sm");
      for (var i = 0, l = 6; i < l; i++) {
        sm.to(i);
      }
      sm.states.length.should.be.eql(5);
      sm.states[0].should.be.eql(1);
      sm.states[4].should.be.eql(5);
    });

    it("should hold the given state limit", function () {
      var sm = new StateMachine("sm", 3);
      for (var i = 0, l = 6; i < l; i++) {
        sm.to(i);
      }
      sm.states.length.should.be.eql(3);
      sm.states[0].should.be.eql(3);
      sm.states[2].should.be.eql(5);
    });
  });

  describe("::add", function () {
    it("should accept string states", function () {
      var sm = new StateMachine("sm");
      sm.add("a", "b", function (from, to) {
        from.should.be.eql("a");
        to.should.be.eql("b");
        return 1;
      });
      sm.to("a");
      sm.to("b");
    });

    it("should accept anything as a state", function () {
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

      sm.to(stateA);
      sm.to(stateB);
      sm.to(stateC);
      sm.to(stateD);
      sm.to(stateE);
      sm.to(stateF);
    });

    describe("#async", function () {

    });

    describe("#sync", function () {

    });
  });

  describe("::to", function () {

  });

});