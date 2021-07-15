const del = require("del");
const pug = require("gulp-pug");
const gulp = require("gulp");
const htmlbeautify = require("gulp-html-beautify");
const debug = require("gulp-debug");
const livereload = require("gulp-livereload");

var liveReloadUp = false;

const clean = function () {
  return del("build/**", { force: true });
};

const copyBasefile = function () {
  return gulp.src("site/**/*").pipe(gulp.dest("build/"));
};

const compilePug = function () {
  if (!liveReloadUp) {
    livereload({ start: true });
    liveReloadUp = true;
  }

  return gulp
    .src("sources/pug/pages/*.pug")
    .pipe(debug({ title: "unicorn:" }))
    .pipe(pug())
    .pipe(gulp.dest("build"));
};

const htmlBeautify = function () {
  return gulp
    .src("build/*.html")
    .pipe(htmlbeautify())
    .pipe(gulp.dest("build/"));
};

const watchFiles = function () {
  gulp
    .watch("sources/pug/**/*", gulp.series("compile-pug", "html-beautify"))
    .on("change", function () {
      debug();
    });
};

gulp.task("clean", clean);
gulp.task("copy-structure", copyBasefile);
gulp.task("compile-pug", compilePug);
gulp.task("html-beautify", htmlBeautify);
gulp.task("live-reload", watchFiles);

gulp.task(
  "build-site",
  gulp.series(
    "clean",
    "copy-structure",
    "compile-pug",
    "html-beautify",
    "live-reload"
  )
);
