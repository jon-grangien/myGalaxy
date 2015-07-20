module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */ \n'
      },
      build: {
        src: [
          'js/MTLLoader.js',
          'js/DDSLoader.js',
          'js/OBJMTLLoader.js',
          'js/OBJLoader.js',
          'js/OrbitControls.js',
          'js/TrackballControls.js',
          'js-includes/*.js'
        ],
        dest: 'minBuild/myGalaxyJS.min.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'js-includes/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-jshint');

  // grunt.registerTask('default', ['jshint', 'uglify']);
  grunt.registerTask('default', ['uglify']);

};