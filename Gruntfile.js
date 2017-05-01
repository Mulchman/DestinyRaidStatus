const child_process = require("child_process");
const fs = require("fs");

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,


    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'main.css': 'scss/main.scss'
        }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')()
        ]
      },
      dist: {
        src: 'main.css',
        dest: 'main.css'
      }
    },

    watch: {
      app: {
        files: [
          'scripts/**/*.{js,html}',
          'views/*.html',
          'scss/*.scss'
        ],
        tasks: ['css'],
        options: {
          atBegin: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('css', ['sass', 'postcss']);
};
