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