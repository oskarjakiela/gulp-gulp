'use strict';

var gutil = require('gulp-util');
var map = require('map-stream');
var path = require('path');
var spawn = require('child_process').spawn;

var plugin = {
  name: 'gulp-gulp'
};

module.exports = function(options) {
  options = typeof options === 'undefined' ? {} : options;

  var isWin = /^win/.test(process.platform);
  var gulpPath = path.join(__dirname, 'node_modules', '.bin');

  var tasks = 'tasks' in options ? options.tasks : [];
  var tasksArgv = process.argv.indexOf('--tasks');

  if (tasksArgv > -1) {
    tasks = process.argv.slice(tasksArgv + 1, process.argv.length);
  }

  if (isWin) {
    process.env.Path += ';' + gulpPath;
  } else {
    process.env.PATH += ':' + gulpPath;
  }

  return map(function(file, cb) {
    var gulpGulp;

    var command = 'gulp';
    var args = [
      '--gulpfile=' + file.path,
    ].concat(tasks);

    var opts = {
      env: process.env,
      stdio: 'inherit'
    }

    if (isWin) {
      command = 'cmd';
      args = [
        '/s',
        '/c',
        'gulp.cmd'
      ].concat(args);

      opts.windowsVerbatimArguments = true;
    }

    gulpGulp = spawn(command, args, opts);

    gulpGulp.on('close', function(code) {
      var error;

      if (code && 65 !== code) {
        error = new gutil.PluginError(plugin.name, file.path + ': returned ' + code);
      }

      cb(error, file);
    });
  });
};
