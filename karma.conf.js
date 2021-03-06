// Note some browser launchers should be installed before using karma start.

// For example:
//      $ npm install karma-firefox-launcher
//      $ karma start --browser=Firefox

// See http://karma-runner.github.io/0.8/config/configuration-file.html
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'mocha-debug'],
    logLevel: config.LOG_INFO,
    port: 9876,

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'lib/index.js': ['coverage']
    },

    // list of files / patterns to load in the browser
    files: [
      'node_modules/should/should.js',
      'test/helper.js',
      'lib/index.js',
      'test/statemachine-spec.js'
    ],

    // Test results reporter to use
    // https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-mocha-debug', 'karma-phantomjs-launcher', 'karma-coverage'],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/',
	  reporters: [
		{ type: 'html', subdir: 'report-html' },
		{ type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
	  ]
    }
  });
};