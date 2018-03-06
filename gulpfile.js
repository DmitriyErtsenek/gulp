'use strict';

var gulp = require('gulp'),
    gp   = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    pngquant = require('imagemin-pngquant'),
    mozjpeg = require('imagemin-mozjpeg');


gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});


gulp.task('pug', function () {
  return gulp.src('src/pages/*.pug')
        .pipe(gp.plumber())
        .pipe(gp.pug({
          pretty:true
        }))
        .on('error', gp.notify.onError())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({
          stream:true
        }));
});


gulp.task('styles', function () {
  return gulp
        .src('src/styles/main.styl')
        .pipe(gp.plumber())
        .pipe(gp.sourcemaps.init())
        .pipe(gp.stylus())
        .on('error', gp.notify.onError())
        .pipe(gp.autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
        .pipe(gp.csso())
        .pipe(gp.sourcemaps.write())
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.reload({
          stream:true
        }));
});


gulp.task('scripts', function() {

  return gulp
    .src('./src/blocks/**/*.js')
    .pipe(gp.concat('main.js'))
    .pipe(gp.uglify())
    .pipe(gulp.dest('./build/js/'))
    .pipe(browserSync.reload({stream: true}));
}); 


gulp.task('fonts', function(){
  return gulp
  .src('./src/fonts/*.woff')
  .pipe(gulp.dest('build/fonts/'))
});

gulp.task('img', function() {
    
  return gulp
    .src('./src/blocks/**/*.+(png|jpg)')
    .pipe(gp.debug({title: 'unicorn:'}))
    .pipe(gp.imagemin([
        pngquant({
          quality: '95'
        }),
        
        mozjpeg({
          progressive: true,
          quality: '85'
        })
        ],{
          verbose: true
        }))
    .pipe(gp.flatten()) // Для переноса изображения без родительской папки
    .pipe(gulp.dest('build/img/'))
});

// gulp.task('js-libs', function() {
//   return gulp
//   .src([
//     './node_modules/jquery/dist/jquery.min.js'
//   ])
//   .pipe(gp.concat('libs.min.js'))
//   .pipe(gp.uglify())
//   .pipe(gulp.dest('build/js/'));
// });

// gulp.task('css-libs', function(){
//   return gulp
//   .src([
//     './node_modules/owl.carousel/dist/assets/owl.theme.default.css',
//     './node_modules/owl.carousel/dist/assets/owl.carousel.css'
//     ])
//   .pipe(gp.concat('libs.min.css'))
//   .pipe(gp.csso())
//   .pipe(gulp.dest('build/css/'));
// });


gulp.task('clear', () =>
  gp.cache.clearAll()
);


gulp.task('clean', function () {
  return gulp.src('./build/', {read: false})
      .pipe(gp.clean());
});


gulp.task('watch', function () {
  gulp.watch(['src/pages/**/*.pug','src/blocks/**/*.pug'], gulp.series('pug'));
  gulp.watch(['src/styles/**/*.styl','src/blocks/**/*.styl'], gulp.series('styles'));
  gulp.watch('src/blocks/**/*.js', gulp.series('scripts'));
});


gulp.task('default', gulp.series(
  'clean', 'fonts', 'img', 
  gulp.parallel('pug','styles', 'scripts'),
  gulp.parallel('watch','serve')
));