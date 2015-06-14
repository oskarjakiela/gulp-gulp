'use strict';

var assert = require('assert');
var mockery = require('mockery');
var gutil = require('gulp-util');
var mockSpawn = require('mock-spawn');
var rewire = require("rewire");
var spawn;
var gulpGulp;
var gulpGulpPath = './';


describe('gulp-gulp', function () {
  var verbose = false;
  var stream;

  beforeEach(function () {
    spawn = mockSpawn(verbose);
    mockery.enable({ useCleanCache: true });
    mockery.warnOnUnregistered(false);
    mockery.warnOnReplace(false);
    mockery.registerMock('child_process', { spawn: spawn });
    mockery.registerAllowable(gulpGulpPath, true);
  });

  afterEach(function () {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  describe('when runs on unix', function() {
    beforeEach(function() {
      gulpGulp = require(gulpGulpPath);

      spawn.sequence.add(function (cb) {
        this.emit('close');
        return cb(1);
      });

      stream = gulpGulp();
      stream.write(new gutil.File({
        path: './fixtures/gulpfile.js'
      }));
    });

    it('should add gulp bin to path', function (done) {
      stream.on('end', function() {
        var firstCall = spawn.calls[0];

        assert.equal(true, firstCall.opts.env.PATH.indexOf('gulp-gulp/node_modules/.bin') > -1);

        done();
      });

      stream.end();
    });

    it('should spawn child process', function (done) {
      stream.on('end', function() {
        var firstCall = spawn.calls[0];

        assert.equal(1, spawn.calls.length);
        assert.equal('gulp', firstCall.command);
        assert.equal('--gulpfile=./fixtures/gulpfile.js', firstCall.args[0]);

        done();
      })

      stream.end();
    });
  });

  describe('when runs on Windows', function() {
    beforeEach(function() {
      gulpGulp = rewire(gulpGulpPath);

      gulpGulp.__set__('process', {
        platform: 'win',
        argv: [],
        env: {
          Path: 'c:/path'
        }
      });

      spawn.sequence.add(function (cb) {
        this.emit('close');
        return cb(1);
      });

      stream = gulpGulp();
      stream.write(new gutil.File({
        path: './test/fixtures/gulpfile.js'
      }));
    });

    it('should add gulp bin to path', function (done) {
      stream.on('end', function() {
        var firstCall = spawn.calls[0];

        assert.equal(true, firstCall.opts.env.Path.indexOf('gulp-gulp/node_modules/.bin') > -1);

        done();
      })

      stream.end();
    });

    it('should spawn child process', function (done) {
      stream.on('end', function() {
        var firstCall = spawn.calls[0];

        assert.equal(1, spawn.calls.length);
        assert.equal('cmd', firstCall.command);
        assert.equal('--gulpfile=./test/fixtures/gulpfile.js', firstCall.args[3]);

        done();
      })

      stream.end();
    });
  });

  describe('when passes tasks through cli', function() {
    var mockProcess = {
      platform: '',
      env: {
        PATH: '/usr/bin'
      }
    };

    beforeEach(function() {
      gulpGulp = rewire(gulpGulpPath);


      spawn.sequence.add(function (cb) {
        this.emit('close');
        return cb(1);
      });
    });

    it('should run gulp with sub-tasks', function(done) {
      mockProcess.argv = ['node', 'gulp', 'gulp', '--tasks', 'watch']

      gulpGulp.__set__('process', mockProcess);

      stream = gulpGulp();
      stream.write(new gutil.File({
        path: './test/fixtures/gulpfile.js'
      }));

      stream.on('end', function() {
        assert.deepEqual([
          '--gulpfile=./test/fixtures/gulpfile.js',
          'watch'
        ], spawn.calls[0].args);

        done();
      })

      stream.end();
    })
  });

  describe('when passes tasks through plugin options', function() {
    beforeEach(function() {
      gulpGulp = require(gulpGulpPath);

      spawn.sequence.add(function (cb) {
        this.emit('close');
        return cb(1);
      });
    });

    it('should run gulp with sub-tasks', function(done) {
      stream = gulpGulp({
        tasks: ['watch']
      });

      stream.write(new gutil.File({
        path: './test/fixtures/gulpfile.js'
      }));

      stream.on('end', function() {
        assert.deepEqual([
          '--gulpfile=./test/fixtures/gulpfile.js',
          'watch'
        ], spawn.calls[0].args);

        done();
      })

      stream.end();
    })
  });
});
