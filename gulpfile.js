const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const minify = require("gulp-minify");
const webp = require("gulp-webp");
const replace = require("gulp-replace");
const path = require("path");
const log = require("fancy-log");

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
    .src(["src/js/**/script.js", "src/js/**/hamburger.js"])
    .pipe(minify())
    .pipe(gulp.dest("src/js"));
});

gulp.task("convertToWebp", function () {
  gulp
    .src("src/images/**/*.{jpg,jpeg,png}", { encoding: false }) // Берем все изображения из исходной папки
    .pipe(webp()) // Конвертируем в формат webp
    .pipe(gulp.dest("src/optimages")); // Сохраняем в папку назначения
});

gulp.task("updateHTMLPaths", function () {
  gulp
    .src(["src/*.html"]) // Берем HTML файлы
    .pipe(replace("images", "optimages"))
    .pipe(gulp.dest("src")); // Сохраняем измененные файлы
});

gulp.task("updateCSSPaths", function () {
  gulp
    .src(["src/css/*.css"]) // Берем CSS файлы
    .pipe(replace("images", "optimages"))
    .pipe(gulp.dest("src/css")); // Сохраняем измененные файлы
});

gulp.task("watch", function () {
  gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel("styles"));
  gulp.watch("src/js/**/*.+(js|mjs)"), gulp.parallel("scripts");
  gulp.watch("src/images/**/*.{jpg,jpeg,png}"), gulp.parallel("convertToWebp");
  gulp.watch("src/**/*.html"), gulp.parallel("updateHTMLPaths");
  gulp.watch("src/**/*.css"), gulp.parallel("updateCSSPaths");
});

gulp.task(
  "default",
  gulp.parallel(
    "watch",
    "server",
    "styles",
    "scripts",
    "convertToWebp",
    "updateHTMLPaths",
    "updateCSSPaths"
  )
);
