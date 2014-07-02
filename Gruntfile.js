'use strict';

module.exports = function(grunt) {

  var Handlebars = require('handlebars'),
      path = require('path');

  grunt.initConfig({
    sass: {                              
      dist: {                            
        options: {                       
          style: 'expanded',
          compass: true,
          sourcemap: true
        },
        files: {                         
          'css/main.css': 'scss/main.scss'
        }
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass']
      }
    },
    handlebars: {
      dist: {
        files: [
          {
            src: ['templates/*.hbs'],
            dest: 'js/templates/'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

  grunt.registerMultiTask('handlebars', 'Compile handlebars templates.', function() {
    this.files.forEach(function (file) {
      file.src.forEach(function (src) {
        var template = grunt.file.read(src),
          fileExtname = path.extname(src),
          outputFilename = path.basename(src, fileExtname),
          outputFilepath = file.dest + outputFilename + '.js',
          output = [];

        output.push('define([\'handlebars\'], function(Handlebars) {\n');
        output.push('return Handlebars.template(' + Handlebars.precompile(template) + ');\n');
        output.push('});');

        grunt.file.write(outputFilepath, output.join(''));
      });
    });

  });

};
