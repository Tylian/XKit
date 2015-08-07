/* global require */
/* jshint node:true */
'use strict';

var csslint = require('gulp-csslint'),
	del = require('del'),
	exec = require('child_process').exec,
	fs = require('fs'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jscs = require('gulp-jscs'),
	merge = require('merge-stream'),
	stylish = require('jshint-stylish'),
	zip = require('gulp-zip');

var BUILD_DIR = 'build';
var paths = {
	scripts: {
		dev: ['gulpfile.js'],
		core: ['editor.js', 'xkit.js'],
		extensions: ['Extensions/**/*.js', '!Extensions/**/*.icon.js']
	},
	css: {
		core: ['xkit.css'],
		extensions: ['Extensions/**/*.css']
	},
	vendor: [
		'jquery.js',
		'moment.js',
		'nano.js',
		'tiptip.js'
	]
};

gulp.task('clean', ['clean:build']);

gulp.task('clean:build', function(cb) {
	del([BUILD_DIR], cb);
});

gulp.task('clean:modules', function(cb) {
	del(['node_modules'], cb);
});

gulp.task('clean:chrome', function(cb) {
	del([BUILD_DIR + '/chrome'], cb);
});

gulp.task('clean:firefox', function(cb) {
	del([BUILD_DIR + '/firefox'], cb);
});

gulp.task('lint:scripts', function() {
	var src = [].concat(
		paths.scripts.dev,
		paths.scripts.core,
		paths.scripts.extensions,
		['Chrome/**/*.js',
		'Firefox/**/*.js']
	);

	return gulp.src(src)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'))
		.pipe(jscs());
});

gulp.task('lint:css', function() {
	var src = [].concat(
		paths.css.core,
		paths.css.extensions
	);

	return gulp.src(src)
		.pipe(csslint())
		.pipe(csslint.reporter());
});

gulp.task('lint', ['lint:scripts']);

gulp.task('copy:chrome', ['clean:chrome', 'lint'], function() {
	var src = [].concat(
		paths.scripts.core,
		paths.css.core,
		paths.vendor,
		['Chrome/**/*']
	);

	return gulp.src(src)
		.pipe(gulp.dest(BUILD_DIR + '/chrome'));
});

gulp.task('compress:chrome', ['copy:chrome'], function() {
	var chromeManifest = JSON.parse(fs.readFileSync('Chrome/manifest.json'));

	return gulp.src(BUILD_DIR + '/chrome/**/*')
		.pipe(zip('new-xkit-' + chromeManifest.version + '.zip'))
		.pipe(gulp.dest(BUILD_DIR + '/chrome'));
});

gulp.task('copy:firefox', ['clean:firefox', 'lint'], function() {
	var js = [].concat(
		paths.scripts.core,
		paths.vendor
	);
	var css = paths.css.core;
	var firefox = ['Firefox/**/*'];

	var extension = gulp.src(firefox)
		.pipe(gulp.dest(BUILD_DIR + '/firefox'));

	var content = gulp.src(js)
		.pipe(gulp.dest(BUILD_DIR + '/firefox/content'));

	var resources = gulp.src(css)
		.pipe(gulp.dest(BUILD_DIR + '/firefox/content/resources'));

	return merge(extension, content, resources);
});

gulp.task('compress:firefox', ['copy:firefox'], function(cb) {
	// `jpm xpi` executable must be expressed relative to `exec({cwd})`
	exec('../../node_modules/.bin/jpm xpi',
		 // `jpm xpi` must be executed from the extension
		 // directory containing a `package.json`.
		 {cwd: 'build/firefox'},
		 function(err, stdout, stderr) {
			if(err) { return cb(err); }
			cb();
		});
});

gulp.task('build:chrome', ['compress:chrome']);

gulp.task('build:firefox', ['compress:firefox']);

gulp.task('build', ['build:chrome', 'build:firefox']);

gulp.task('watch', function() {
	gulp.watch('**/*.js', ['lint:scripts']);
	gulp.watch('**/*.css', ['lint:css']);
});

gulp.task('default', ['lint']);
