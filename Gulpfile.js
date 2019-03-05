/**
 * Gulpfile
 * @author Alexandre Simonin
 * @created 21/02/2019
 */

'use strict';

const 
  // Gulp utilisation
  gulp = require('gulp'),

  // Combine gulp with sass utilisation
  sass = require('gulp-sass'),

  // Combine multiples plugins
  postcss = require('gulp-postcss'),

  // Parser for scss
  scss = require('postcss-scss'),

  // Autoprefix css properties
  autoprefixer = require('autoprefixer'),

  // Clean and minify CSS files
  cssnano = require('cssnano'),

  // Clean and concat JS files
  concat = require('gulp-concat'),

  // Minify JS files
  uglify = require('gulp-uglify'),

  // Generate sourcemaps
  sourcemaps = require('gulp-sourcemaps');

const DIR = {
    'src': './app',
    'dest': './dist'
};

/**
 * @task styles
 * Compile sass/scss to unique css file
 */
gulp.task('styles', function (done) {
  gulp.src(DIR.src + '/scss/**/*.+(scss|sass)')
      .pipe(sourcemaps.init())
      .pipe(sass({
          outputStyle: 'expanded'
      }).on('error', sass.logError))
      // .pipe(autoprefixer({
      //     browsers: ['last 4 versions'],
      //     cascade: false
      // }))
      .pipe(postcss([
        autoprefixer({
          browsers: ['last 4 versions']
        })
      ], { syntax: scss }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIR.dest + '/css/'));
      done();
});

/**
 * @task scripts
 * Compile js scripts to unique js file
 */
gulp.task('scripts', function (done) {
  gulp.src([
      DIR.src + '/js/externals/**/*.js',
      DIR.src + '/js/**/*.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('app.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(DIR.dest + '/js/'));
  done();
});

/**
 * @task styles-prod
 * Compile sass/scss for production environment
 */
gulp.task('styles-prod', function (done) {
  const plugins = [
      autoprefixer({browsers: ['last 4 versions']}),
      cssnano()
  ];
  gulp.src(DIR.src + '/scss/**/*.+(scss|sass)')
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss(plugins, { syntax: scss }))
    .pipe(gulp.dest(DIR.dest + '/css/prod/'));
    done();
});

/**
 * @task scripts-prod
 * Compile js scripts for production environement
 */
gulp.task('scripts-prod', function (done) {
  gulp.src([
      DIR.src + '/js/externals/**/*.js',
      DIR.src + '/js/**/*.js'
  ])
  .pipe(concat('app.js'))
  .pipe(uglify())
  .pipe(gulp.dest(DIR.dest + '/js/'));
  done();
});

 /**
 * @task watch
 * Compile/watch app with development restrictions
 */
gulp.task('watch', function () {
  gulp.watch(DIR.src + '/scss/**/*.+(scss|sass)', gulp.series('styles'));
  gulp.watch(DIR.src + '/js/**/*.js', gulp.series('scripts'));
});

/**
 * @task dist-dev
 * Compile styles and scripts with development restrictions
 */
gulp.task('dist-dev', gulp.parallel('styles', 'scripts'), function (done) {
  done();
});

/**
 * @task dist-prod
 * Compile styles and scripts for production optimisation
 */
gulp.task('dist-prod', gulp.parallel('styles-prod', 'scripts-prod'), function (done) {
  done();
});

/**
 * @task default
 * Compile app with development restrictions
 */
gulp.task('default', gulp.series('dist-dev'), function (done) {
  done();
});

// gulp.task('default',
//   gulp.series('clean', gulp.parallel('scripts', 'styles'),
//     function() {

//     }
//   )
// );