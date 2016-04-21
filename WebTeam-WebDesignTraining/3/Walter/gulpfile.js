// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('./scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest("./scss/"))
});

gulp.task('default', ['sass'], function() {
    gulp.watch('./scss/**/*.scss', ['sass']);
})