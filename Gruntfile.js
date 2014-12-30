module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'lib/**/*.js']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint']);
};