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

    // By default this processes all .pug files from/to the root directory
    // To keep a specific directory structure, you'll need to tweak the files config
    // https://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
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
          {
            cwd: 'app/views',
            src: ['*.pug'],
            // here is how you would add another page directory
            // just make sure you include an index.pug in the root
            // src: ['*.pug', 'folder/*.pug'],
            dest: '.tmp/',
            ext: '.html',
            expand: true,
          },
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
          {
            cwd: 'app/views',
            src: ['*.pug'],
            // here is how you would add another page directory
            // just make sure you include an index.pug in the root
            // src: ['*.pug', 'folder/*.pug'],
            dest: '.tmp/',
            ext: '.html',
            expand: true,
          },
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
          '.tmp/scripts/main.min.js': 'app/scripts/main.js',
        },
      },
    },

    uglify: {
      dist: {
        files: {
          '.tmp/scripts/main.min.js': '.tmp/scripts/main.min.js',
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
      options: {
        livereload: true,
      },
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
  grunt.registerTask('build', ['check', 'clean', 'pug:dist', 'htmlmin', 'sass', 'copy:media', 'copy:jquery', 'babel', 'postcss', 'uglify', 'copy:dist']);
  grunt.registerTask('build:dev', ['check', 'clean', 'pug:dev', 'htmlmin', 'sass', 'copy:media', 'copy:jquery', 'babel', 'postcss']);
  grunt.registerTask('deploy', ['build', 's3:build', 'cloudfront:build']);
  grunt.registerTask('serve', ['build:dev', 'open', 'http-server', 'watch']);
  grunt.registerTask('default', ['serve']);
};
