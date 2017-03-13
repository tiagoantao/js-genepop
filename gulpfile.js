let gulp = require("gulp"),
    ts = require("gulp-typescript"),
    mocha = require('gulp-mocha')

let tsProject = ts.createProject("tsconfig.json")

gulp.task('test', ['build'] , function() {
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
