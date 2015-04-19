var gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    buffer = require('vinyl-buffer'),
    minifycss = require('gulp-minify-css'),
    minifyhtml = require('gulp-minify-html'),
    processhtml = require('gulp-processhtml'),
    jshint = require('gulp-jshint'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    gulpif = require('gulp-if'),
    vinylPaths = require('vinyl-paths'),
    paths;

paths = {
  assets: 'src/assets/**/*',
  css:    'src/css/*.css',
  libs:   [
    './bower_components/phaser-official/build/phaser.js'
  ],
  js:     ['src/js/*.js', 'src/js/**/*.js'],
  entry: './src/js/main.js',
  dist:   './dist/'
};

gulp.task('clean', function () {
	return gulp.src(paths.dist)
    .pipe(vinylPaths(del))
    .on('error', gutil.log);
});

gulp.task('copy', ['clean'], function () {
  gulp.src(paths.assets)
    .pipe(gulp.dest(paths.dist + 'assets'))
    .on('error', gutil.log);
});

gulp.task('copylibs', ['clean'], function () {
  gulp.src(paths.libs)
    .pipe(uglify({outSourceMaps: false}))
    .pipe(gulp.dest(paths.dist + 'js/lib'))
    .on('error', gutil.log);
});

gulp.task('minifycss', ['clean'], function () {
 gulp.src(paths.css)
    .pipe(minifycss({
      keepSpecialComments: false,
      removeEmpty: true
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('processhtml', ['clean'], function() {
  return gulp.src('src/index.html')
    .pipe(processhtml())
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('minifyhtml', ['processhtml'], function() {
  gulp.src('dist/index.html')
    .pipe(minifyhtml())
    .pipe(gulp.dest(paths.dist))
    .on('error', gutil.log);
});

gulp.task('html', ['build'], function(){
  gulp.src('dist/*.html')
    .pipe(connect.reload())
    .on('error', gutil.log);
});

gulp.task('connect', function () {
  connect.server({
    root: ['./dist'],
    port: 9000,
    livereload: true
  });
});


var customOpts = {
    cache: {}, packageCache: {}, fullPaths: true,
    entries: [paths.entry],
    debug: false
};

var b = watchify(browserify(customOpts));

function bundle() {
    return b.bundle()
        .pipe(source('main.min.js'))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        // .pipe(buffer())
        // .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(sourcemaps.write('./'))
        //.pipe(streamify(uglify({outSourceMaps: false})))
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload())
        .on('error', gutil.log);
}
gulp.task('compile', bundle);

gulp.task('watch', function () {
    b.on('update', bundle);
});

gulp.task('default', ['connect', 'watch', 'build']);
gulp.task('build', ['clean', 'copy', 'copylibs', 'compile', 'minifycss', 'processhtml', 'minifyhtml']);
