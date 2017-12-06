var gulp =					require('gulp'),
		sass =					require('gulp-sass'),
		autoprefixer =	require('gulp-autoprefixer'),
		htmlmin =				require('gulp-htmlmin'),
		cssmin =				require('gulp-clean-css'),
		rename =				require('gulp-rename'),
		jsmin =					require('gulp-uglify'),
		concat =				require('gulp-concat'),
		sync =					require('browser-sync').create(),
		imagemin =			require('gulp-imagemin'),
		remove =				require('gulp-clean');

var sourceDir = "./src/",
		distDir = "./dist/";


gulp.task('sass', function() {
	return gulp.src(sourceDir + "sass/**/*.sass")
	.pipe(sass().on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({
		browsers: ['last 15 versions'],
		cascade: false
	}))
	.pipe(cssmin())
	.pipe(gulp.dest(distDir + "css"))
	.pipe(sync.stream());
});

gulp.task('html-minify', function() {
	return gulp.src(sourceDir + "*.html")
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(distDir));
});

gulp.task('scripts-minify', function() {
	return gulp.src([
		sourceDir + "libs/jquery/jquery.min.js",
		sourceDir + "libs/owl.carousel/dist/owl.carousel.min.js",
		sourceDir + "libs/e-detective-engine/resolution.lib.js",
		sourceDir + "libs/e-detective-engine/resModule.lib.js",
		sourceDir + "libs/jquery-slimscroll/jquery.slimscroll.min.js",
		sourceDir + "libs/intense-images/intense.min.js"
	])
	.pipe(concat('libs.js'))
	.pipe(jsmin())
	.pipe(gulp.dest(distDir + "js/"));
});

gulp.task('sync', function() {
	sync.init({
		server: {baseDir: distDir}
	});
});

gulp.task('img-delete', function() {
	return gulp.src(distDir + "img/*")
	.pipe(remove());
});

gulp.task('img-minify', ['img-delete'], function() {
	return gulp.src(sourceDir + "img/**/*.+(png|jpg|gif|svg|ico)")
	.pipe(imagemin())
	.pipe(gulp.dest(distDir + "img/"));
});

gulp.task('watch', ['sass', 'html-minify', 'scripts-minify', 'img-minify', 'sync'], function() {
	gulp.watch(sourceDir + "sass/**/*.sass", ['sass']);
	gulp.watch(sourceDir + "*.html", ['html-minify']);
	gulp.watch(sourceDir + "libs/**/*.js", ['scripts-minify']);
	gulp.watch(sourceDir + "img/**/*.+(png|jpg|gif|svg)", ['img-minify']);
	gulp.watch(distDir + "*.html").on('change', sync.reload);
	gulp.watch(distDir + "js/**/*.js").on('change', sync.reload);
	gulp.watch(distDir + "img/**/*.+(png|jpg|gif|svg)").on('change', sync.reload);
});

gulp.task('start', ['watch'], function() {
	console.log("Gulp started");
});

gulp.task('default', function() {
	console.log();
	console.log("***************************************");
	console.log();
	console.log("'gulp start' - for start main function");
	console.log("'gulp img-minify' - minification of images(png|jpg|gif|svg) from ./src/img to ./dist/img");
	console.log();
	console.log("***************************************");
	console.log();
});

gulp.task('help', function() {
	console.log();
	console.log("***************************************");
	console.log();
	console.log("'src' folder contains all sources and non-processing files");
	console.log("'dist' folder - final folder(production folder), it's result");
	console.log();
	console.log("***************************************");
	console.log();
});
