module.exports = function(grunt) {
    grunt.initConfig({
        uncss: {
            dist: {

                files: {
                    'css/site.css': ['index.html']
                }

                /*
                files: [{
                    nonull: true,
                    src: ['http://localhost:55049/LicenseeWinLossReport'],
                    dest: 'css/licwinloss.css'
                }]
                */
            },
        }
    });

    grunt.loadNpmTasks('grunt-uncss');

    grunt.registerTask('default', ['uncss']);

};