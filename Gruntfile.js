/*global module:false*/

var _ = require('underscore');

module.exports = function(grunt) {

  /**
   * Parse valid browser names.
   * @param  {String} browsers Names to parse.
   * @return {Array}           Recognized browser names.
   */
  var parseBuildBrowsers = function(browsers) {
    var knownBrowsers = ['chrome', 'firefox', 'safari'];
    var browserList = [];

    browserList = _.intersection(browsers.split(','), knownBrowsers);

    // If no matches found, build all browser extensions.
    if(browserList.length === 0) {
      browserList = knownBrowsers;
    }

    return browserList;
  };

  /**
   * Generate a grunt task list from a list of browsers.
   * @param {String} browsers List of browser names.
   * @return {Array}          List of grunt tasks to run.
   */
  var genBuildTaskList = function(browsers) {
    var gruntTaskList = [
      'clean:releases',
    ];

    browserList = parseBuildBrowsers(browsers);

    browserList.forEach( function(browser) {
      gruntTaskList.push('jshint:' + browser);
      gruntTaskList.push('copy:' + browser);
      if(/firefox/.test(browser)) {
        gruntTaskList.push('compress:firefox');
      }
    });

    return gruntTaskList;
  };

  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= pkg.license %> */\n',

    // Task configuration

    // grunt-contrib-clean task
    clean: {
      build: ['build/*'],
      releases: ['build/releases/*'],
      modules: ['node_modules'],
    },

    // grunt-contrib-jshint task
    jshint: {
      options: {
        jshintrc: ".jshintrc",
      },
      gruntfile: {
        src: 'Gruntfile.js',
      },
      // Hell Nope
      // extensions: {
      //   src: [
      //     'Extensions/**/*.js',
      //     '!Extensions/**/*.icon.js',
      //   ],
      // },
      chrome: {
        src: [
          'Chrome/**/*.js',
        ],
      },
      firefox: {
        src: [
          'Firefox/**/*.js',
        ],
      },
      safari: {
        src: [
          'Safari/**/*.js',
        ],
      },
    },

    // grunt-contrib-copy task
    copy: {
      chrome: {
        files: [
          {expand: true, cwd: 'Chrome/', src: '**/*', dest: 'build/releases/chrome/'},
          {src: ['*.js', '*.css', '!Gruntfile*'], dest: 'build/releases/chrome/'},
        ],
      },
      firefox: {
        files: [
          {expand: true, cwd: 'Firefox/', src: '**/*', dest: 'build/releases/firefox/'},
          {src: ['*.js', '!Gruntfile*'], dest: 'build/releases/firefox/content/'},
          {src: '*.css', dest: 'build/releases/firefox/content/resources/'},
        ],
      },
      safari: {
        files: [
          {expand: true, cwd: 'Safari/', src: '**/*', dest: 'build/releases/XKit.safariextension/'},
          {src: ['*.js', '*.css', '!Gruntfile*'], dest: 'build/releases/XKit.safariextension/'},
        ],
      },
    },

    // grunt-contrib-compress task
    compress: {
      firefox: {
        options: {
          mode: 'zip',
          archive: 'build/releases/firefox.xpi'
        },
        files: [
          {expand: true, cwd: 'build/releases/firefox' ,src: ['**/*']},
        ],
      },
    },

    // grunt-contrib-watch task
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile'],
      },
      extensions: {
        files: [
          'Extensions/**/*.js',
          '!Extensions/**/*.icon.js',
        ],
        tasks: ['jshint:extensions'],
      },
      chrome: {
        files: [
          'Chrome/**/*.js',
        ],
        tasks: ['jshint:chrome'],
      },
      firefox: {
        files: [
          'Firefox/**/*.js',
        ],
        tasks: ['jshint:firefox'],
      },
      safari: {
        files: [
          'Safari/**/*.js',
        ],
        tasks: ['jshint:safari'],
      },
    },

  });

  // Grunt-contrib tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task
  grunt.registerTask('default', ['jshint']);

  // Browser extension build task
  grunt.registerTask('build', function(browsers) {
    if(browsers === null || browsers === undefined) {
      browsers = 'all';
    }
    grunt.task.run(genBuildTaskList(browsers));
  });
};
