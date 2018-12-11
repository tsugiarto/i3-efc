var gulp = require('gulp');
var gulpIf = require('gulp-if');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var kit = require('gulp-kit');
var prettify = require('gulp-prettify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var useref = require('gulp-useref');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var svg2png = require('gulp-svg2png');
var svgSymbols = require('gulp-svg-symbols');
var svgmin = require('gulp-svgmin');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

function handleErrors() {
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: 'Compile Error',
		message: '<%= error.message %>'
	}).apply(this, args);
	this.emit('end');
}

// Starting browserSync server
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist/',
		},
		notify: {
			styles: {
				borderRadius: '8px 0 0',
				bottom: '0',
				top: 'auto'
			}
		}
	});
});

// Compiling stuffs
gulp.task('kit-js-dist', function() {
	return gulp.src('kit/**/*.kit')
		.pipe(kit())
		.pipe(prettify({indent_char: '\t', indent_size: 1, preserve_newlines: true, unformatted: ['a', 'span', 'img', 'code', 'pre', 'sub', 'sup', 'em', 'strong', 'b', 'i', 'u', 'strike', 'big', 'small', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'svg','br', 'label', 'input', 'script', 'time'], wrap_line_length: 0}))
		.pipe(useref({ searchPath: './' }))
		.pipe(gulpIf('assets/js/bundle.js', babel({ presets: ['es2015'] })))
		.pipe(gulpIf('assets/js/bundle.js', uglify()))
		.pipe(gulp.dest('dist/'));
});

gulp.task('kit', function() {
	return gulp.src('kit/**/*.kit')
		.pipe(kit().on('error', handleErrors))
		.pipe(gulp.dest('dist/'));
});

gulp.task('kit-reload', ['kit'], function() {
	browserSync.reload();
});

gulp.task('sass', function() {
	return gulp.src('assets/scss/**/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', handleErrors))
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
		.pipe(gulp.dest('dist/assets/css/'))
		.pipe(browserSync.stream());
});

gulp.task('js-hint', function() {
	gulp.src(['assets/js/style.js', 'assets/js/script.js'])
		.pipe(jshint({ esnext: true }))
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail')).on('error', handleErrors);
});

gulp.task('js', function() {
	gulp.run('js-hint');

	return gulp.src('assets/js/**/*')
		.pipe(gulp.dest('dist/assets/js/'));
});

gulp.task('js-reload', ['js'], function() {
	browserSync.reload();
});

gulp.task('doc-kit', function() {
	return gulp.src('_doc/*.kit')
		.pipe(kit())
		.pipe(gulp.dest('dist/_doc/'));
});

gulp.task('doc-kit-reload', ['doc-kit'], function() {
	browserSync.reload();
});

gulp.task('doc-sass', function() {
	return gulp.src('_doc/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', handleErrors))
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
		.pipe(gulp.dest('dist/_doc/'))
		.pipe(browserSync.stream());
});

gulp.task('svg', function() {
	return gulp.src('assets/images/**/*.svg')
		.pipe(svgmin({
			plugins: [{
				cleanupIDs: false
			}]
		}))
		.pipe(gulp.dest('dist/assets/images/'))
		.pipe(browserSync.stream());
});

gulp.task('svg-sprite', ['svg'], function() {
	return gulp.src('assets/images/symbols/**/*.svg')
		.pipe(svgmin())
		.pipe(svgSymbols())
		.pipe(gulp.dest('dist/assets/images/'))
		.pipe(browserSync.stream());
});

// Copying assets & uploads
gulp.task('root', function() {
	return gulp.src(['root/**/*', 'root/**/.*'])
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});

gulp.task('assets', function() {
	return gulp.src(['assets/**/*', '!assets/images/**/*.svg', '!assets/js/**/*', '!assets/{scss,scss/**}'])
		.pipe(gulp.dest('dist/assets/'))
		.pipe(browserSync.stream());
});

gulp.task('uploads', function() {
	return gulp.src('uploads/**/*')
		.pipe(gulp.dest('dist/uploads/'))
		.pipe(browserSync.stream());
});

// Watching for changes
gulp.task('watch', function() {
	gulp.watch('kit/**/*.kit', ['kit-reload']);
	gulp.watch('_doc/*.kit', ['doc-kit-reload']);
	gulp.watch('_doc/*.scss', ['doc-sass']);
	gulp.watch('root/**/*', ['root']);
	gulp.watch(['assets/**/*', '!assets/images/**/*.svg', '!assets/{js,js/**}', '!assets/{scss,scss/**}'], ['assets']);
	gulp.watch('assets/images/**/*.svg', ['svg', 'svg-sprite']);
	gulp.watch('assets/js/**/*.js', ['js-reload']);
	gulp.watch('assets/scss/**/*.scss', ['sass' , 'doc-sass']);
	gulp.watch('uploads/**/*', ['uploads']);
});

// Cleaning unused assets
gulp.task('clean', function() {
	return del.sync('dist/');
});

// Building Sequence
gulp.task('default', function() {
	runSequence(['kit', 'sass', 'js', 'doc-kit', 'doc-sass', 'root', 'assets', 'svg-sprite', 'uploads', 'browserSync', 'watch']);
});

gulp.task('build', function() {
	runSequence('clean', 'kit-js-dist', ['sass', 'doc-kit', 'doc-sass', 'root', 'assets', 'svg-sprite', 'uploads']);
});
