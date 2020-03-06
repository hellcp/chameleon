"use strict";

const gulp = require("gulp");
const browserify = require("browserify");
const log = require("gulplog");
const tap = require("gulp-tap");
const buffer = require("gulp-buffer");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-dart-sass");
const autoprefixer = require("gulp-autoprefixer");
const connect = require("gulp-connect");
const open = require("gulp-open");
const pug = require("gulp-pug");
const svgSprite = require("gulp-svg-sprite");
const header = require("gulp-header");
const footer = require("gulp-footer");
const rename = require("gulp-rename");
const wait = require("gulp-wait");

// Compile JavaScripts with sourcemaps
gulp.task("js", function() {
  return gulp
    .src(["src/js/*.js", "src/js/components/*.js"], { read: false })
    .pipe(
      tap(function(file) {
        log.info("bundling " + file.path);
        file.contents = browserify(file.path, { debug: true }).bundle();
      })
    )
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist/js"))
    .pipe(wait(500))
    .pipe(connect.reload());
});

// Copy jQuery and Bootstrap JS
gulp.task("copy", function() {
  return gulp
    .src([
      "node_modules/jquery/dist/jquery.slim.js",
      "node_modules/bootstrap/dist/js/bootstrap.bundle.js*"
    ])
    .pipe(gulp.dest("dist/js"));
});

// Compile SaSS stylesheets with sourcemaps
gulp.task("sass", function() {
  return gulp
    .src("src/sass/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: ["node_modules"]
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist/css"))
    .pipe(wait(500))
    .pipe(connect.reload());
});

// Icons (SVG Sprite in JS)
gulp.task("icons-svg", function() {
  return gulp
    .src([
      "node_modules/remixicon/icons/Buildings/*-line.svg",
      "node_modules/remixicon/icons/Business/*-line.svg",
      "node_modules/remixicon/icons/Communication/*-line.svg",
      "node_modules/remixicon/icons/Design/*-line.svg",
      "node_modules/remixicon/icons/Development/*-line.svg",
      "node_modules/remixicon/icons/Device/*-line.svg",
      "node_modules/remixicon/icons/Document/*-line.svg",
      "node_modules/remixicon/icons/Editor/*-line.svg",
      "node_modules/remixicon/icons/Finance/*-line.svg",
      "node_modules/remixicon/icons/Logos/*-line.svg",
      "node_modules/remixicon/icons/Map/*-line.svg",
      "node_modules/remixicon/icons/Media/*-line.svg",
      "node_modules/remixicon/icons/Others/*-line.svg",
      "node_modules/remixicon/icons/System/*-line.svg",
      "node_modules/remixicon/icons/User/*-line.svg",
      "node_modules/remixicon/icons/Weather/*-line.svg",
      "src/icons/*.svg",
      "!src/icons/sprite.svg"
    ])
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: "icons",
            sprite: "sprite.svg"
          }
        }
      })
    )
    .pipe(gulp.dest("src"));
});

gulp.task("icons-js", function() {
  return gulp
    .src("src/icons/sprite.svg")
    .pipe(header("module.exports = '"))
    .pipe(footer("';"))
    .pipe(rename("sprite.js"))
    .pipe(gulp.dest("src/js/data"));
});

gulp.task("icons", gulp.series("icons-svg", "icons-js"));

// Documents
gulp.task("docs", function() {
  return gulp
    .src("docs/pug/pages/**/*.pug")
    .pipe(pug())
    .pipe(gulp.dest("./"))
    .pipe(wait(500))
    .pipe(connect.reload());
});

// Build all
gulp.task("build", gulp.parallel("js", "sass", "docs", "icons", "copy"));
gulp.task("default", gulp.parallel("build"));

// Watch all
gulp.task("watch", function() {
  // start web server with live reload
  connect.server({
    root: ".",
    port: "8044",
    debug: true,
    livereload: true
  });
  // start web browser to load test pages
  gulp.src(".").pipe(open({ uri: "http://localhost:8044" }));

  gulp.watch("src/sass/**/*.scss", gulp.parallel("sass"));
  gulp.watch(["src/js/**/*.js", "src/langs/*.json"], gulp.parallel("js"));
  gulp.watch(["*.md", "docs/**/*.md", "docs/**/*.pug"], gulp.parallel("docs"));
});
