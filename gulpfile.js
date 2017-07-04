'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var tsify = require("tsify");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
gulp.task('build-ts', function () {
	return browserify({
		entries: ["example.tsx"],
		debug: true
	}).plugin(tsify)
		.bundle()
		.pipe(source('out.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		// Add transformation tasks to the pipeline here.
		.pipe(uglify())
		.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./'));
});