var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var bSync = require('browser-sync');
var ngAnnotate = require('browserify-ngannotate');
var buffer = require('vinyl-buffer');
var reload = bSync.reload;
var cachebust = new plugins.cachebust();
var del = require('del');

var paths = {
    partials: './client/app/**/*.html',
    style: './client/app/sass/style.scss',
    bootstrap: './client/app/vendor/bootstrap-sass/bootstrap.scss',
    images: './client/app/assets/imgs/**/*',
    dist: './client/public/',
    srcIndex: './client/app/index.html'
  };

gulp.task('cleanStyle', function (cb) {
  return del([
          paths.dist + 'css'
  ]);
})

gulp.task('style',['cleanStyle'], function () {
    return gulp.src([paths.style])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            includePaths: [paths.style],
          }).on('error', plugins.sass.logError))
        .pipe(plugins.concat('styles.css'))
        .pipe(plugins.cleanCss())
        .pipe(cachebust.resources())
        .pipe(plugins.sourcemaps.write('./maps'))
        .pipe(gulp.dest('./client/public/css'));
  });

gulp.task('images', function () {
    return gulp.src(paths.images)
        .pipe(plugins.image())
        .pipe(gulp.dest('./client/public/images'));
  });

/*  for now just copying over the partials
******************************************/
gulp.task('partials', function () {
    return gulp.src(paths.partials)
            .pipe(gulp.dest('./client/public/'));
  });


/* js related tasks
*****************************************/
gulp.task('cleanJs', function (cb) {
  return del([
          paths.dist + 'js'
  ]);
})
gulp.task('browserify', ['cleanJs'], function () {
  var b = browserify({
    entries: './client/app/app.js',
    debug: true,
    transform: [ngAnnotate]
  });
  
  return b.bundle()
    .pipe(source('bundle.js'))
        .pipe(plugins.ngAnnotate())
        .pipe(buffer())
        .pipe(cachebust.resources())
        .pipe(plugins.sourcemaps.init({loadMaps: true}))
        .pipe(plugins.uglify({mangle: false}))
        .on('error', plugins.util.log)
        .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./client/public/js/'));
});


gulp.task('browser-sync', ['nodemon'], function() {
  bSync({
    proxy: 'localhost:8080',  // local node app address
    port: 5000,  // use *different* port than above
    notify: true,
    files: './client/public/**/*',
    //browser: 'firefox',
    watchOptions: {
        ignoreInitial: true
    }
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return plugins.nodemon({
    script: './server/server.js',
    ignore: [
      'gulpfile.js',
      'node_modules/',
      'client/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('updateIndex', function(cb){
  return gulp.src(paths.srcIndex)
        .pipe(cachebust.references())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('watch',  function () {
  
  // if js files changed, run browserify
  // then update index.html
  gulp.watch('client/app/**/*.js', function () {
    plugins.sequence('browserify', 'updateIndex')(function (err) {
      if (err) console.log(err)
    })
  });

  // if html files copied over, we need to update
  // index again
  gulp.watch( paths.partials, function () {
    plugins.sequence('partials', 'updateIndex')(function (err) {
      if (err) console.log(err)
    })
  });

  // if css files changed, we need to also update the
  // index file with the right file.
  gulp.watch('client/app/**/*.scss', function () {
    plugins.sequence('style', 'updateIndex')(function (err) {
      if (err) console.log(err)
    })
  });

  //if an image added, lets optimize and move to destination.
  gulp.watch('client/app/**/*.png', ['images']);
});

// run partials, browserify, styles and images in parallel
// then update cache reference
// then run browser-sync
// then start watching.
gulp.task('default', 
  plugins.sequence(
    [
      'partials', 
      'browserify', 
      'style', 
      'images'
    ], 
    'updateIndex', 
    'browser-sync',
    'watch'
  )
);

