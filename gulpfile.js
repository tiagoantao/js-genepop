let gulp = require("gulp"),
    istanbul = require('gulp-istanbul'),
    ts = require("gulp-typescript"),
    mocha = require('gulp-mocha')

let tsProject = ts.createProject("tsconfig.json")

gulp.task('pretest', () => {
    return gulp.src('dist/main.js')
        .pipe(istanbul({
            instrumenter: require('isparta').Instrumenter
        }))
        .pipe(istanbul.hookRequire())
})

gulp.task('test', ['build', 'pretest'] , function() {
    return gulp.src('./tests/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('tests'))
    .pipe(mocha())
})

gulp.task('build', function () {
    let my_ts = tsProject.src().pipe(tsProject())

    my_ts.pipe(gulp.dest('src'))
    return my_ts.pipe(gulp.dest('dist'))
})

gulp.task("default", ['build'], () => {})
