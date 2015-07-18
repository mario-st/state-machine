var fs = require("fs");
var path = require("path");
var pkg = require("../package.json");
var exec = require("child_process").exec;

var root = path.join(__dirname, "..");

var basename = pkg.name;
var srcFile = path.join(root, "dist", basename + ".js");

fs.writeFileSync(srcFile, [
  fs.readFileSync(path.join(root, "build", "intro.frag")),
  fs.readFileSync(path.join(root, "lib", "index.js")),
  fs.readFileSync(path.join(root, "build", "outro.frag"))
].join("\r\n"), "utf8");

exec("npm run uglify", {cwd: root}, function (err, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (err !== null) {
    console.log('exec error: ' + err);
  }
});
