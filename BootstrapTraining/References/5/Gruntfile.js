module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    sass: {
      build: {
        src: "css/style.scss",
        dest: "css/style.css"
      }
    },
    watch: {
      sass: {
        files: "css/**/*.scss",
        tasks: ["sass"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task(s).
  grunt.registerTask("default", ["watch"]);
}
