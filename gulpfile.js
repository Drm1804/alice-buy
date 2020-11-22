const { series, parallel, src, dest } = require("gulp");
const zip = require("gulp-zip");
const del = require("del");

const packageJson = require("./package.json");

function zipFile() {
  return src("temp/**").pipe(zip(`${Date.now()}.zip`)).pipe(dest("dist"));
}

function dependencies() {
  const moduleFiles = Object.keys(packageJson.dependencies).map(
    (module) => `node_modules/${module}**/**/*.*`
  );
  return src(moduleFiles).pipe(dest("temp/node_modules"));
}

function source() {
  return src("src/*").pipe(dest("temp"));
}

function clear() {
  return del(["temp/**/*"]);
}

exports.default = series(clear, parallel(dependencies, source), zipFile);
