import gulp from 'gulp';
import ts from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function () {
  return gulp
    .src(['src/**/*.ts'], { base: 'src' })
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist2'));
});

gulp.task('default', gulp.series('build'));