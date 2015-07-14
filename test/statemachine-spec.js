describe("StateMachine", function () {

  describe("constructor", function () {
    it("should be an instance of StateMachine", function () {
      var sm = new StateMachine("sm");
      sm.should.be.instanceOf(StateMachine);
    });

    it("should hold 5 states by default", function () {
      var sm = new StateMachine("sm");
      for (var i = 0, l = 6; i < l; i++) { sm.to(i); }
      sm.states.length.should.be.eql(5);
      sm.states[0].should.be.eql(1);
      sm.states[4].should.be.eql(5);
    });

    it("should hold the given state limit", function () {
      var sm = new StateMachine("sm", 3);
      for (var i = 0, l = 6; i < l; i++) { sm.to(i); }
      sm.states.length.should.be.eql(3);
      sm.states[0].should.be.eql(3);
      sm.states[2].should.be.eql(5);
    });
  });

  describe("::add", function () {
    it("should accept string states", function () {

    });

    describe("#async", function () {

    });

    describe("#sync", function () {

    });
  });

  describe("::to", function () {

  });

});