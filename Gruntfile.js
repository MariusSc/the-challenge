'use strict';

module.exports = function(grunt) {
  grunt.initConfig({

    exec: {
      mochaTests: {
        cmd: 'node ./node_modules/mocha/bin/mocha ./spec/ --reporter spec --debug'
      }
    },
    eslint: {
      target: ['app.js', 'app/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('default', ['eslint', 'exec:mochaTests']);
};
