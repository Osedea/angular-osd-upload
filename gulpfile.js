var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    karma = require('gulp-karma');

var paths = {
    js: [
        'src/app.js',
        'src/config.js',
        'src/constants.js',
        'src/image-upload.js',
        'src/angular-osd-upload.js',
    ],
    test: [
        'bower_components/angular/angular.js',
        'bower_components/ng-file-upload/angular-file-upload.min.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'src/app.js',
        'src/config.js',
        'src/constants.js',
        'src/image-upload.js',
        'src/angular-osd-upload.js',
        'test/**/*.js',
    ]
};

gulp.task('default', ['watch']);

gulp.task('build', ['js']);

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(concat('angular-osd-upload.js'))
        .pipe(gulp.dest('./'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./'))
        .on('error', gutil.log);
});

gulp.task('watch', ['build'], function() {
    gulp.watch(paths.js, ['js', 'test']);
});

gulp.task('test', function() {
    return gulp.src(paths.test)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'watch',

        }))
        .on('error', gutil.log);
});
