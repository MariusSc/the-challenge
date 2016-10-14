var config = require('./config/config');

module.exports = function (grunt) {
  grunt.initConfig({

    mongoimport: {
      options: {
        db: config.db.name,
        host: config.db.host,
        port: config.db.port,
        collections: [{
          name: 'widgets',
          file: 'data/widgets.json',
          jsonArray: true,
          drop: true
        }]
      }
    },
    exec: {
      
      jshint_test: {
       cmd: 'node -v' // cmd: './node_modules/jshint/bin/jshint --verbose app/ config/ app.js *.js'
      },

      integration_tests: {
        cmd: 'node ./node_modules/mocha/bin/mocha ./spec/ --reporter spec --no-timeouts --debug'
      }      
    },
    mocha_istanbul: {
      coverage: {
        src: 'spec', // a folder works nicely
        options: {
          mask: '*_spec.js'
        }
      }
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
          check: {
            lines: 80,
            statements: 80
          }
        }
      }
    },
    eslint: {
      target: ['app.js', 'app/**/*.js']
    }
  });

  // grunt.event.on('coverage', function (lcov, done) {
  //   console.log(lcov);
  //   done(); 
  // });


  grunt.loadNpmTasks('grunt-mongoimport');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-eslint');
  
  // Todo: Improvement - add code coverage 
  // grunt.loadNpmTasks('grunt-mocha-istanbul');


  // grunt.registerTask('default', ['mongoimport', 'exec:jshint_test', 'exec:jasmine_test']);
  grunt.registerTask('test', [ 'eslint', 'exec:integration_tests']);
  // grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
};
