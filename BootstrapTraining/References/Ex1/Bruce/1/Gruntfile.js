module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		sass:{
			options: {
                compress: false
            },
            dev: {
                expand: true,
                src: "css/*.scss",
                ext: ".css",
                extDot: "last"
            }
		},
		watch: {
            sass: {
                files: "css/*.scss",
                tasks: ["sass"]
            }
        }
	});

    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
	
	// Default task(s).
	grunt.registerTask("default", ["watch"]);
}