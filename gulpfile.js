var gulp = require('gulp');
var deploy = require('gulp-gh-pages');
var scripts = require('gulp-uglify');
var styles = require('gulp-minify-css');
var inline = require('gulp-inline-source');

gulp.task('scripts', function(){
	gulp.src('dev/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'));
	
	gulp.src('dev/views/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/views/js/'));
});

/*
gulp.task('styles', function(){
	gulp.src('dev/css/*.css')
		.pipe(minify())
		.pipe(gulp.dest('dist/css/'));
	
	gulp.src('dev/views/css/*.css')
		.pipe(minify())
		.pipe(gulp.dest('dist/views/css/'));
});
*/



gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});

gulp.task('default', function() {
	console.log('Gulp is running');
});