var gulp = require('gulp'),
	less = require('gulp-less'),
	livereload = require('gulp-livereload'),
	minifyCss = require('gulp-minify-css'),
	rename = require("gulp-rename"),
	concat = require('gulp-concat'),
//var minify = require('gulp-minify');
	uglify = require('gulp-uglify'),
	zip = require('gulp-zip'),
	del = require('del'),
	readline = require('linebyline'),
	file = require('gulp-file'),
	jsdoc = require('gulp-jsdoc');
	

//Gulp config
var config = {
	lessUrl:'./src/less/azureui.less',
	distCSSUrl: './dist/css',
	compressJsFileName: 'azureui.js',
	webfont: {
		soureDirectory: './fonts/icomoon/azure-icon/fonts/**',
		outputDirectory: './dist/fonts/',
		icomoon: {
			startLine: 28,
			directory: './fonts/icomoon/azure-icon/',
			varLessFile: 'variables.less',
			styleLessFile: 'style.less'
		},
		azure: {
			directory: './less/azure-icon/',
			variablesLessFile: 'azure-icon-variables.less',
			classnameLessFile: 'azure-icon-classname.less'
		}
	},
	zipFilename: 'AzureUIWebFonts.zip'
};

//Less Compress
gulp.task('compressLess', function() {
  return gulp.src(config.lessUrl)
    .pipe(less())
    .pipe(gulp.dest(config.distCSSUrl))
    .pipe(livereload());
});
gulp.task('minifyCSS', ['compressLess'], function() {
	return gulp.src(['./dist/css/*.css', '!./dist/css/*.min.css'])
		.pipe(minifyCss({
			compatibility: 'ie8'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist/css/'));
});

//Javascript Compress
gulp.task('compressJs', function() {
	return gulp.src('./js/*.js')
		.pipe(concat(config.compressJsFileName))
		.pipe(gulp.dest('./dist/js/'))
});
gulp.task('minifyJs', ['compressJs'], function() {
	return gulp.src(['./dist/js/*.js', '!./dist/js/*.min.js'])
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist/js/'));
});

//Clean files


//Copy all the font files to the dist directory.
gulp.task('copyWebfonts', function() {
	return gulp.src(config.webfont.soureDirectory)
		.pipe(gulp.dest(config.webfont.outputDirectory));
});

//Delete azure icon variables file and azure icon classname file. 
gulp.task('delOldFile', function() {
	return del([config.webfont.azure.directory + config.webfont.azure.variablesLessFile, config.webfont.azure.directory + config.webfont.azure.classnameLessFile]);
});

//Get azure icon classname file content from the icomoon style.less file.
gulp.task('updateWebfontLess', ['updateVariablesLessCode'], function() {
	var readIcomoonLess = readline(config.webfont.icomoon.directory + config.webfont.icomoon.styleLessFile);
	var lessString = "";
	readIcomoonLess.on('line', function(line, lineCount) {
		if (lineCount >= config.webfont.icomoon.startLine) {
			lessString = lessString + line + '\n';
		}
	}).on('end', function() {
		return file(config.webfont.azure.classnameLessFile, lessString, {
			src: true
		}).pipe(gulp.dest(config.webfont.azure.directory));
	});
});

//Get azure icon variables file content from the icomoon variables.less file.
gulp.task('updateVariablesLessCode', ['delOldFile'], function() {
	gulp.src(config.webfont.icomoon.directory + config.webfont.icomoon.varLessFile)
		.pipe(rename({
			basename: config.webfont.azure.variablesLessFile.slice(0,-5)
		}))
		.pipe(gulp.dest(config.webfont.azure.directory));
});

//Compress all the file to a zip file and put it in download directory.
gulp.task('compressAllToZipFile', ['minifyJs', 'minifyCSS', 'copyWebfonts', 'updateWebfontLess'], function() {
	return gulp.src(['./dist/**', '!./dist/js/**'])
		.pipe(zip(config.zipFilename))
		.pipe(gulp.dest('./download'));
});

var tpl = {
    path            : "ink-docstrap",
    systemName      : "Azure UI",
    footer          : "Azure UI Javascript Library API Document",
    copyright       : 'Author: <a href="mailto:v-zhlong@microsoft.com">Jason Zhang</a>',
    navType         : "vertical",
    theme           : "cerulean",
    dateFormat 		: "YYYY-MM-DD HH:mm:ss",
    linenums        : true,
    collapseSymbols : false,
    inverseNav      : false
  }

//Generate API document
gulp.task('generateAPIDocument', ['compressAllToZipFile'], function(){
	gulp.src(['./dist/js/*.js', 'README.md'])
  		.pipe(jsdoc('./docs/documentation-output', tpl))
});

gulp.task('default', ['minifyCSS']);

//Watcher
//Less Watcher
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./src/less/*.less', ['less']);
  gulp.watch(['./test/**']).on('change', livereload.changed);
});