var gulp = require('gulp'),
	clean = require('gulp-clean'),
	less = require('gulp-less'),
	sourcemaps = require('gulp-sourcemaps'),
	livereload = require('gulp-livereload'),
	minifyCss = require('gulp-minify-css'),
	rename = require("gulp-rename"),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	//var minify = require('gulp-minify');
	//zip = require('gulp-zip'),
	//readline = require('linebyline'),
	//file = require('gulp-file'),
	jsdoc = require('gulp-jsdoc');
	
//Task config
var config = {
	AXLessUrl:'./src/less/azureui.less',
	AXDistCSSUrl: './dist/css',
	//TODO: Import form JSON.
	ACNLessUrl: ['./ACN/src/less/common.less', './ACN/src/less/documentation-content.less'],
	ACNDistCSSUrl: './ACN/css',
	ACNClearCSSFiles: ['./ACN/css/common.css','./ACN/css/common.min.css'],
	copyFile:{
		AX:{
			soureDirectory: './dist/js/*.js',
			outputDirectory: './ACN/scripts/lib'	
		},
		ACNProject: {
			outputDirectory: ''	
		}
	},
	compressJsFileName: 'azurex.js',
	webfont: {
		soureDirectory: './src/fonts/icomoon/azure-icon/fonts/**',
		outputDirectory: './dist/fonts/',
		icomoon: {
			startLine: 28,
			directory: './src/fonts/icomoon/azure-icon/',
			varLessFile: 'variables.less',
			styleLessFile: 'style.less'
		},
		azure: {
			directory: './src/less/azure-icon/',
			variablesLessFile: 'azure-icon-variables.less',
			classnameLessFile: 'azure-icon-classname.less'
		}
	},
	zipFilename: 'AzureUIWebFonts.zip'
};

//Clean files
gulp.task('cleanAXCSS', function(){
	return gulp.src(['./dist/css/*'])
	.pipe(clean());
});
gulp.task('cleanACNCSS', function(){
	return gulp.src(config.ACNClearCSSFiles)
	.pipe(clean());
});
gulp.task('cleanJS', function(){
	return gulp.src(['./dist/js/*'])
	.pipe(clean());
});
gulp.task('cleanFonts', function(){
	return gulp.src(['./dist/fonts/*'])
	.pipe(clean());
});

//Less Compress
gulp.task('compressAXLess', ['cleanAXCSS'], function() {
  return gulp.src(config.AXLessUrl)
  	.pipe(sourcemaps.init())
    .pipe(less({
    	//paths: ['./src/less', './src/less/mixins']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.AXDistCSSUrl))
    .pipe(livereload());
});
gulp.task('compressACNLess', ['cleanACNCSS'], function() {
  return gulp.src(config.ACNLessUrl)
  	.pipe(sourcemaps.init())
    .pipe(less({
    	//paths: ['./src/less', './src/less/mixins']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.ACNDistCSSUrl))
    .pipe(livereload());
});

gulp.task('minifyAXCSS', ['compressAXLess'], function() {
	return gulp.src(['./dist/css/*.css', '!./dist/css/*.min.css'])
		.pipe(minifyCss({
			compatibility: 'ie8'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task('minifyACNCSS', ['compressACNLess'], function() {
	return gulp.src(config.ACNClearCSSFiles[0])
		.pipe(minifyCss({
			compatibility: 'ie8'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./ACN/css/'));
});

//Javascript Compress
gulp.task('compressJs', ['cleanJS'], function() {
	return gulp.src('./src/js/*.js')
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

//Generate API document
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
gulp.task('generateAPIDocument', ['minifyJs'], function(){
	return gulp.src(['./dist/js/*.js', 'README.md'])
		.pipe(jsdoc('./docs/documentation-output', tpl));
});

//Copy compressed javascript library to demo directory
gulp.task('copyAzureJsToACN', function() {
	return gulp.src(config.copyFile.AX.soureDirectory)
		.pipe(gulp.dest(config.copyFile.AX.outputDirectory));
});

//Copy all the font files to the dist directory.
gulp.task('copyWebfonts', function() {
	return gulp.src(config.webfont.soureDirectory)
		.pipe(gulp.dest(config.webfont.outputDirectory));
});

//Get azure icon classname file content from the icomoon style.less file.
//gulp.task('updateWebfontLess', ['updateVariablesLessCode'], function() {
//	var readIcomoonLess = readline(config.webfont.icomoon.directory + config.webfont.icomoon.styleLessFile);
//	var lessString = "";
//	readIcomoonLess.on('line', function(line, lineCount) {
//		if (lineCount >= config.webfont.icomoon.startLine) {
//			lessString = lessString + line + '\n';
//		}
//	}).on('end', function() {
//		return file(config.webfont.azure.classnameLessFile, lessString, {
//			src: true
//		}).pipe(gulp.dest(config.webfont.azure.directory));
//	});
//});

//Get azure icon variables file content from the icomoon variables.less file.
//gulp.task('updateVariablesLessCode', ['delOldFile'], function() {
//	gulp.src(config.webfont.icomoon.directory + config.webfont.icomoon.varLessFile)
//		.pipe(rename({
//			basename: config.webfont.azure.variablesLessFile.slice(0,-5)
//		}))
//		.pipe(gulp.dest(config.webfont.azure.directory));
//});

//Compress all the file to a zip file and put it in download directory.
//gulp.task('compressAllToZipFile', ['minifyJs', 'minifyCSS', 'copyWebfonts', 'updateWebfontLess'], function() {
//	return gulp.src(['./dist/**', '!./dist/js/**'])
//		.pipe(zip(config.zipFilename))
//		.pipe(gulp.dest('./download'));
//});

gulp.task('default', ['minifyAXCSS', 'generateAPIDocument', 'copyWebfonts', 'minifyACNCSS', 'copyAzureJsToACN']);
//gulp.task('default', ['minifyACNCSS']);

//Watcher
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./src/less/**', ['compressAXLess']); //AX Less watcher
  gulp.watch('./src/js/**', ['minifyJs']); //AX scripts watcher
  gulp.watch('./ACN/src/less/**', ['minifyACNCSS']); //ACN scripts watcher
  gulp.watch(['./ACN/**']).on('change', livereload.changed); //Auto refresh browser when the file is modified.
});