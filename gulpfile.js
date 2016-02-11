// Load in our dependencies
var gulp = require('gulp');
var gulpSass = require('gulp-sass');

// Define our tasks
gulp.task('build-css', function buildCss () {
  // Generate a stream that compiles SCSS to CSS
  // DEV: We return the pipe'd stream so gulp knows when we exit
  return gulp.src('public/css/index.scss')
    .pipe(gulpSass({
      style: 'nested'
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('build', ['build-css']);
