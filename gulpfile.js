const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const minify = require("gulp-minify");
const webp = require("gulp-webp");

gulp.task("server", function () {
  browserSync({
    server: {
      baseDir: "src",
    },
  });

  gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task("styles", function () {
  return gulp
    .src("src/sass/**/*.+(scss|sass)")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

gulp.task("scripts", function () {
  gulp
    .src(["src/js/**/*.js", "src/js/**/*.mjs"])
    .pipe(minify())
    .pipe(gulp.dest("src/js"));
});

gulp.task("convertToWebp", function () {
  gulp.src(
    "images/**/*.{jpg, jpeg, png}",
    { encoding: false }.pipe(webp()).pipe(gulp.dest("src/optimages"))
  );
});

gulp.task("watch", function () {
  gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel("styles"));
  gulp.watch("src/js/**/*.+(js|mjs)"), gulp.parallel("scripts");
  gulp.watch("src/images/**/*.{jpg, jpeg, png}"),
    gulp.parallel("convertToWebp");
});

gulp.task(
  "default",
  gulp.parallel("watch", "server", "styles", "scripts", "convertToWebp")
);
