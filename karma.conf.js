// Karma configuration

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath:  '',

    // list of files / patterns to load in the browser
    files:  [

      // Test environment
      'components/cjohansen-sinon/sinon.js',

      // Test dependencies
      'build/test.js',

      // Test Source files
      'spec/spec_helper.js',
      'spec/**/*.js'
    ],


    // list of files to exclude
    exclude:  [
      'spec/coverage'
    ],

    // Custom frameworks
    // frameworks:  ['jasmine'], Use jasmine to test in ie 6-
    frameworks:  ['mocha'],



    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters:  ['progress'], // , 'coverage'],


    // web server port
    port:  9876,


    // cli runner port
    runnerPort:  9100,


    // enable / disable colors in the output (reporters and logs)
    colors:  true,


    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel:  LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch:  true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers:  ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout:  60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun:  false,

    // Coverage preprocessors
    // preprocessors:  {
    //  '**/lib/*.js': 'coverage'
    // },

    // Converage configuration
    coverageReporter:  {
      type : 'html',
      dir  : 'spec/coverage'
    }
  });
}
