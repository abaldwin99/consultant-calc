module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },

            build: ['Gruntfile.js', 'src/**/*.js']
        },

        uglify: {
            build: {
                files: {
                    'dist/js/consult.min.js': 'src/js/consult.js',
                    'dist/js/consult-input.min.js': 'src/js/consult-input.js'

                }
            }
        },

        cssmin: {
            build: {
                files: {
                    'dist/css/consult.min.css': 'src/css/consult.css'
                }
            }
        },

        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'uglify']
            },
            css: {
                files: ['src/**/*.css'],
                tasks: ['cssmin']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);

};