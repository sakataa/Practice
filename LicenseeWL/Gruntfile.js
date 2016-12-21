module.exports = function (grunt) {
    grunt.initConfig({
        uncss: {
            dist: {
                files: {
                    'css/site.css': ['index.html']
                }
            },
        }
    });

    grunt.loadNpmTasks('grunt-uncss');

    grunt.registerTask('default', ['uncss']);

};