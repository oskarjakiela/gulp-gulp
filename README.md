gulp-gulp [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]] [travis-url]
=========

> A [gulp](https://github.com/gulpjs/gulp) plugin to run other gulps.

## Usage

Initially, install `gulp-gulp` as a development dependency:

```shell
npm install --save-dev gulp-gulp
```

Then, create task using `gulp-gulp`, which might look similar as below:

```javascript
'use strict';

var gulp = require('gulp');
var gulpGulp = require('gulp-gulp');

gulp.task('gulp', function() {
  return gulp.src('./**/*/gulpfile.js')
    .pipe(gulpGulp());
});
```

Finally, fire gulp task:

```shell
gulp gulp
```

If you have following (clean, move, run) sub-gulp tasks you can run like: this

```javascript
gulp.task('gulp', function() {
  return gulp.src('./**/*/gulpfile.js')
    .pipe(gulpGulp({
      tasks: ['clean', 'move', 'run']
    }));
});
```

Or directly through shell:

```shell
gulp gulp --tasks clean move run
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


[npm-url]: https://npmjs.org/package/gulp-gulp
[npm-image]: https://badge.fury.io/js/gulp-gulp.png
[travis-url]:https://travis-ci.org/oskarjakiela/gulp-gulp
[travis-image]: https://travis-ci.org/oskarjakiela/gulp-gulp.svg?branch=master