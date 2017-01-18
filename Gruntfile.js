/* eslint-disable no-var */

var fs, loadGruntTasks, stamp, slice = [].slice;

fs = require('fs');

loadGruntTasks = require('load-grunt-tasks');

// for cache-busting files with a query param
stamp = new Date().getTime();

module.exports = function(grunt) {
  loadGruntTasks(grunt);

  grunt.initConfig({
    aws: grunt.file.readJSON('credentials.json'),

    pug: {
      dist: {
        options: {
          data: function() {
            return {
              stamp: stamp,
              dev: false,
            };
          },
        },
        files: [
          grunt.file.expandMapping(['*.pug', 'pg/*.pug'], '.tmp/', {
            cwd: 'app/views',
            ext: '.html',
          }),
        ],
      },
      dev: {
        options: {
          data: function() {
            return {
              stamp: stamp,
              dev: true,
            };
          },
        },
        files: [
          grunt.file.expandMapping(['*.pug', 'pg/*.pug'], '.tmp/', {
            cwd: 'app/views',
            ext: '.html',
          }),
        ],
      },
    },

    sass: {
      dist: {
        files: {
          '.tmp/styles/app.css': 'app/styles/app.scss',
        },
      },
    },

    copy: {
      media: {
        files: [
          {
            expand: true,
            cwd: 'app',
            src: ['media/**/*'],
            dest: '.tmp/',
          },
        ],
      },
      jquery: {
        files: [
          {
            expand: true,
            cwd: 'app',
            src: ['app/bower_components/jquery/dist/jquery.min.js'],
            dest: '.tmp/scripts/jquery.min.js',
          },
        ],
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp',
            src: '**/*',
            dest: 'dist/',
          }, {
            expand: true,
            cwd: 'app',
            src: ['robots.txt', 'favicon.ico'],
            dest: 'dist/',
          }, {
            expand: true,
            cwd: 'app/redirects',
            src: '*',
            dest: 'dist/',
          },
        ],
      },
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('pixrem')(),
          require('postcss-nested')(),
          require('autoprefixer')({
            browsers: 'last 3 versions',
          }),
          require('cssnano')(),
        ],
      },
      dist: {
        src: '.tmp/styles/app.css',
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['latest', 'stage-0'],
      },
      dist: {
        files: {
          '.tmp/scripts/scripts.min.js': 'app/scripts/main.js',
        },
      },
    },

    uglify: {
      dist: {
        files: {
          '.tmp/scripts/scripts.min.js': '.tmp/scripts/scripts.min.js',
        },
      },
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyJS: true,
          minifyCSS: true,
        },
        files: [
          {
            expand: true,
            cwd: '.tmp',
            src: '**/*.html',
            dest: '.tmp',
            rename: function(dest, src) {
              return dest + '/' + (src.replace('.html', ''));
            },
          },
        ],
      },
    },

    open: {
      build: {
        path: 'http://localhost:9001',
        options: {
          delay: 1000,
        },
      },
    },

    'http-server': {
      dev: {
        root: __dirname + '/.tmp',
        ext: 'html',
        port: 9001,
        contentType: 'text/html',
        runInBackground: true,
      },
    },

    watch: {
      pug: {
        files: 'app/views/**/*.pug',
        tasks: ['pug:dev', 'htmlmin'],
      },
      sass: {
        files: 'app/styles/**/*.scss',
        tasks: ['sass', 'postcss'],
      },
      babel: {
        files: 'app/scripts/**/*.js',
        tasks: ['babel'],
      },
      copy: {
        files: 'media/**/*',
        tasks: ['copy:media'],
      },
      options: {
        livereload: {
          port: 35830,
        },
      },
    },

    clean: {
      dist: ['dist/*', '.tmp/*'],
    },

    checkDependencies: {
      bower: {
        options: {
          packageManager: 'bower',
          install: true,
          continueAfterInstall: true,
        },
      },
      npm: {
        options: {
          packageManager: 'npm',
          install: true,
          continueAfterInstall: true,
        },
      },
    },

    s3: {
      options: {
        accessKeyId: '<%= aws.accessKeyId %>',
        secretAccessKey: '<%= aws.secretAccessKey %>',
        // If you see the following error, you may have the wrong region defined:
        // Warning: getFileList:fetchObjects:S3.listObjects: The bucket you are
        // attempting to access must be addressed using the specified endpoint.
        region: 'us-east-1',
        bucket: 'fire-starter', // update this
        overwrite: true,
        cache: false,
        gzip: true,
        concurrency: 50,
        access: 'public-read',
        mimeDefault: 'text/html',
      },
      build: {
        cwd: 'dist/',
        src: '**',
      },
    },

    cloudfront: {
      build: {
        options: {
          distributionId: 'XXXXXXXXXXXXXX', // update this
          invalidations: ['/*'],
        },
      },
    },
  });

  grunt.registerTask('check', ['checkDependencies']);
  grunt.registerTask('build', ['pug:dist', 'htmlmin', 'sass', 'copy:media', 'copy:jquery', 'babel', 'postcss', 'uglify', 'copy:dist']);
  grunt.registerTask('build:dev', ['pug:dev', 'htmlmin', 'sass', 'copy:media', 'copy:jquery', 'babel', 'postcss']);
  grunt.registerTask('deploy', ['check', 'build', 's3:build', 'cloudfront:build']);
  grunt.registerTask('serve', ['check', 'clean', 'build:dev', 'open', 'http-server', 'watch']);
  grunt.registerTask('default', ['serve']);
};
