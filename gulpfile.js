let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');
    // sourcemaps = require('gulp-sourcemaps');
    // cleanCSS = require('gulp-clean-css');

gulp.task('clean', async function () {
  del.sync('dist')
})

gulp.task('css', function () {
  return gulp.src([
      'node_modules/normalize.css/normalize.css',
      // 'node_modules/slick-carousel/slick/slick.css',
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('./src/scss'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('scss', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 4 versions"],
      grid: "autoplace",
      cascade: false
    }))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({stream: true}))
});



gulp.task('html', function () {
  return gulp.src('./*.html')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function () {
  return gulp.src('./src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify({toplevel: true}))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function () {
  return gulp.src([
    // 'node_modules/slick-carousel/slick/slick.js'
    // сюда добавляем файлы
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify({toplevel: true}))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('watch', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('./*.html', gulp.parallel('html'))
  gulp.watch('./src/js/*.js', gulp.parallel('script'))
});


gulp.task('default', gulp.parallel(gulp.series('css', 'scss'), 'script', 'browser-sync', 'watch'));


// в gulp.task('default', ...) добавить 'js', когда будем загружать доп библиотеки на js. Без файлов он выдаёт ошибку