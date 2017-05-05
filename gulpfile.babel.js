import gulp from 'gulp';
import clean from 'gulp-clean';
import babel from 'gulp-babel';
import server from './dev/server/server'
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';


gulp.task('build:clean', () => {
  return gulp.src('./bin').pipe(clean({ read: false }));
});

gulp.task('build:compile', ['build:clean'], () => {
  return gulp.src('./src/**/*.js')
             .pipe(babel())
             .pipe(gulp.dest('bin'));
});

gulp.task('build', ['build:clean', 'build:compile']);

gulp.task('serve:build-client-app', ['build'], () => {
  return browserify(['dev/client/app/index.js'])
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(source('app.js')) // First create a named file package
    .pipe(buffer()) // Then turn that fracker into a gulp-compatible package
    .pipe(gulp.dest('dev/client'));
})

gulp.task('serve', ['build', 'serve:build-client-app'], () => {
  server.listen(8080, () => {
    console.log('Dev server listening on port', 8080);
    gulp.watch(['./src/**/*.js', './dev/client/app/**/*.js'], ['serve:build-client-app']);
  });
});
