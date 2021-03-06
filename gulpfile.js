// Gulp tasks for Tachyons
// Load plugins
var gulp = require('gulp'),
    fs = require('fs'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    prefix = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    csslint = require('gulp-csslint'),
    fileinclude = require('gulp-file-include'),
    browserSync = require('browser-sync'),
    browserReload = browserSync.reload;

// Use csslint without box-sizing or compatible vendor prefixes (these
// don't seem to be kept up to date on what to yell about)
gulp.task('csslint', function(){
  gulp.src('./css/tachyons.css')
    .pipe(csslint({
          'compatible-vendor-prefixes': false,
          'box-sizing': false,
          'important': false,
          'known-properties': false
        }))
    .pipe(csslint.reporter());
});

// Task that compiles scss files down to good old css
gulp.task('pre-process', function(){
  gulp.src('./_sass/tachyons.scss')
      .pipe(watch(function(files) {
        return files.pipe(sass())
          .pipe(size({gzip: false, showFiles: true, title:'un-prefixed css'}))
          .pipe(size({gzip: true, showFiles: true, title:'un-prefixed gzipped css'}))
          .pipe(prefix())
          .pipe(size({gzip: false, showFiles: true, title:'prefixed css'}))
          .pipe(size({gzip: true, showFiles: true, title:'prefixed css'}))
          .pipe(gulp.dest('css'))
          .pipe(minifyCSS())
          .pipe(rename('tachyons.min.css'))
          .pipe(gulp.dest('./css/'))
          .pipe(size({gzip: false, showFiles: true, title:'minified css'}))
          .pipe(size({gzip: true, showFiles: true, title:'minified css'}))
          .pipe(browserSync.reload({stream:true}));
      }));
});

gulp.task('minify-css', function(){
  gulp.src('./css/tachyons.css')
    .pipe(uncss({
      html: [
        './index.html',
        './_posts/2013-04-11-what-is-css-for.html',
        './_posts/2013-12-21-vim-workflows.html',
        './_posts/2014-03-26-communication.html',
        './_posts/2014-12-18-caring.html'
      ],
      ignore: [':hover', ':focus', ':visited', ':link', ':active']
    }))
    .pipe(minifyCSS())
    .pipe(rename('tachyons.min.css'))
    .pipe(gulp.dest('./css/'))
    .pipe(size({gzip: false, showFiles: true, title:'minified css'}))
    .pipe(size({gzip: true, showFiles: true, title:'minified css'}));
});

// Initialize browser-sync which starts a static server also allows for
// browsers to reload on filesave
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./"
        }
    });
});

// Function to call for reloading browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/*
   DEFAULT TASK

 • Process sass then auto-prefixes and lints outputted css
 • Starts a server on port 3000
 • Reloads browsers when you change html or sass files

*/
gulp.task('default', ['pre-process', 'minify-css', 'bs-reload', 'browser-sync'], function(){
  gulp.start('pre-process', 'csslint');
  gulp.watch('_sass/*.scss', ['pre-process']);
  gulp.watch('css/tachyons.css', ['bs-reload']);
  //gulp.watch('views/**', ['generateDocs']);
  gulp.watch(['*.html',], ['bs-reload']);
});

