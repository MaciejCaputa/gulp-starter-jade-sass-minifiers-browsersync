// Gulp Dependencies
var gulp          = require('gulp');
var jade          = require('gulp-jade');
var sass          = require('gulp-sass');
var prefix        = require('gulp-autoprefixer');
var uglify        = require('gulp-uglify');
var markdown      = require('gulp-markdown');
var data          = require('gulp-data');
var concat        = require('gulp-concat');
var rename        = require("gulp-rename");
var fs            = require('fs');
var pump          = require('pump');
var browserSync   = require('browser-sync');
var bourbon       = require('bourbon').includePaths;

// Paths
var paths = {
  jsFiles:  'assets/scripts/**/*.js',
  jsDest:   'dist/scripts'
};

// --- JSON ---
gulp.task('json', function() {
  return gulp.src(['./assets/*.json'])
  .pipe(gulp.dest('./_site/assets'));
});

gulp.task('images', function() {
  return gulp.src(['./assets/3-images/*.gif', './assets/3-images/*.png', './assets/3-images/*.jpg', './assets/3-images/*.jpeg'])
  .pipe(gulp.dest('./_site/assets/images'));
});

// --- SCRIPT ---

// Concats and minifyes app scripts.
gulp.task('js-scripts', function() {
  return gulp.src(['./assets/1-scripts/**/*.js'])
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./_site/assets/scripts'))
    .pipe(rename('app.min.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest('./_site/assets/scripts'));
});


// --- MARKDOWN ---
gulp.task('markdown', function () {
  return gulp.src('documentation/**')
    .pipe(markdown())
    .pipe(gulp.dest('_site/documentation'));
});

// --- SASS ---
gulp.task('sass', function() {
  return gulp.src(['assets/2-stylesheets/main.sass', 'assets/2-stylesheets/markdown.sass'])
  .pipe(sass({
      includePaths: [bourbon],
      onError: browserSync.notify
  }).on('error', sass.logError))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest('./_site/assets/stylesheets'));
});

// --- JADE --
gulp.task('jade', function() {
    return gulp.src(['./**/*.jade', '!./_jadefiles/**', '!./node_modules/**'])
    .pipe(data( function(file) {

            } ))
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./_site'));
});

//--- WATCH ---
gulp.task('jade-watch',             ['jade'],             browserSync.reload);
gulp.task('sass-watch',             ['sass'],             browserSync.reload);
gulp.task('markdown-watch',         ['markdown'],         browserSync.reload);
gulp.task('json-watch',             ['json'],             browserSync.reload);
gulp.task('js-scripts-watch',       ['js-scripts'],       browserSync.reload);

// --- BUILD ---
gulp.task('build', ['jade', 'sass', 'markdown', 'json', 'images','js-scripts'], function() {
});

// --- DEFAULT ---
gulp.task('default', ['build'], function() {
  browserSync({
    server: {
      baseDir: './_site'
    }
  })

  gulp.watch( ['assets/*.json'],                    ['json-watch'] );
  gulp.watch( ['assets/1-scripts/**/*.js'],         ['js-scripts-watch'] );
  gulp.watch( ['assets/2-stylesheets/**/*.sass'],   ['sass-watch'] );
  gulp.watch( ['**/*.jade'],                        ['jade-watch'] )
  gulp.watch( ['documentation/**/*.md'],            ['markdown-watch'] );
});
