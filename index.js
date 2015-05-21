'use strict';

var gutil = require('gulp-util');
var map = require('map-stream');
var path = require('path');
var spawn = require('child_process').spawn;

var plugin = {
  name: 'gulp-gulp'
};

module.exports = function(task) {
  var isWin = /^win/.test(process.platform);
  var gulpPath = path.join(__dirname, '..', '..', 'node_modules', '.bin');

  task = typeof task === 'undefined' ? 'default' : task;

  if (isWin) {
    process.env.Path += ';' + gulpPath;
  } else {
    process.env.PATH += ':' + gulpPath;
  }

  return map(function(file, cb) {
    var gulpGulp;

    if (isWin) {
      gulpGulp = spawn('cmd', [
        '/s',
        '/c',
        'gulp.cmd',
        '--gulpfile=' + file.path,
        task
      ], {
        env: process.env,
        stdio: 'inherit',
        windowsVerbatimArguments: true 
      });
    } else {
      gulpGulp = spawn('gulp', [
        '--gulpfile=' + file.path,
        task
      ], {
        env: process.env,
        stdio: 'inherit'
      });
    }

    gulpGulp.on('close', function(code) {
      var error;

      if (code && 65 !== code) {
        error = new gutil.PluginError(plugin.name, plugin.name + ': returned ' + code);
      }

      cb(error, file);
    });
  });
};
