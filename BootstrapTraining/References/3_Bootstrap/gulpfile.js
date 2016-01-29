/**
 * Created by faisall.tran on 12/14/2015.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var bourbon = require('node-bourbon');

gulp.task('sass', function(){
    return gulp.src('Styles/sass/*.scss')
        .pipe(sass({
            includePaths: require('node-bourbon').includePaths
        }))
        .pipe(gulp.dest('Styles/css'))
});

gulp.task('watch', ['sass'],  function() {
    gulp.watch('Styles/sass/*.scss', ['sass']);
});