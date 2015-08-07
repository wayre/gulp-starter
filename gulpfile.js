/*=============================================
=            Gulp Starter by @dope            =
=============================================*/

/**
*
* The packages we are using
* Not using gulp-load-plugins as it is nice to see whats here.
*
**/
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var uglify       = require('gulp-uglify');
var rename       = require("gulp-rename");
var imagemin     = require("gulp-imagemin");
var jshint       = require('gulp-jshint');
var concat       = require('gulp-concat');
var sourcemaps   = require('gulp-sourcemaps');
var pngquant     = require('imagemin-pngquant');
var resources    = require('gulp-resources');
var replace      = require('gulp-replace');
var gif          = require('gulp-if');


/**
*
* Styles
* - Compile
* - Compress/Minify
*
**/
gulp.task('sass', function() {
  gulp.src('./scss/app.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(plumber())
    .pipe(gulp.dest('./assets/css'));
});


/**
*
* BrowserSync.io
* - Watch CSS, JS & HTML for changes
* - View project at: localhost:3000
*
**/
gulp.task('browser-sync', function() {
  browserSync.init(['assets/css/*.css', 'assets/js/**/*.js', 'index.html'], {
    server: {
      baseDir: './'
    }
  });
});


/**
*
* Javascript
* - Uglify
*
**/
gulp.task('scripts', function() {
  gulp.src('assets/js/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  // .pipe(uglify())
  // .pipe(rename({
  //   dirname: "min",
  //   suffix: ".min",
  // }))
  .pipe(gulp.dest('./assets/js'))
});

/**
*
* Images
* - Compress them!
*
**/
gulp.task('images', function () {
  return gulp.src('assets/images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('./assets/images'));
});

/**
 *
 * Build task
 * - Copy files from ./app/ to ./dist/
 * - concat js files
 *
 */
gulp.task('build', function(){
  gulp.src(['./index.html'])
  .pipe(resources())
  .pipe(gif('**/*.js', concat('assets/js/app-all.js')))
  .pipe(gif('**/*.js', uglify()))
  .pipe(gif('**/*.html', replace(/<!--startjs-->[^]+<!--endjs-->/, '<script src="js/app-all.js"></script>')))
  .pipe(gulp.dest('./build'));
});

/**
*
* Default task
* - Runs sass, browser-sync, scripts and image tasks
* - Watchs for file changes for images, scripts and scss/css
*
**/
gulp.task('default', ['sass', 'browser-sync', 'scripts', 'images'], function () {
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('assets/js/**/*.js', ['scripts']);
  gulp.watch('assets/images/*', ['images']);
});
