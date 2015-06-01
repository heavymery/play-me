'use strict';

//------------------------------------------------------------------------------
//
//  Initialize
//
//------------------------------------------------------------------------------

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

//--------------------------------------
//  Constants
//--------------------------------------

  var CONNECT_HOST = grunt.option('connect-host') || '0.0.0.0';
  var CONNECT_PORT = grunt.option('connect-port') || 9001;

  var CONNECT_PORT_DOC = grunt.option('connect-port-doc') || 9002;
  var LIVERELOAD_PORT_DOC = grunt.option('livereload-port-doc') || 35729;

//--------------------------------------
//  Plugin tasks configuration
//--------------------------------------

  grunt.initConfig({

    path: {
      tmp: '.tmp',
      tmpImages: '<%= path.tmp %>/images',
      tmpConcatScripts: '<%= path.tmp %>/concat/scripts',

      app: 'app',
      appImages: '<%= path.app %>/images',
      appScripts: '<%= path.app %>/scripts',

      dist: 'dist',
      distImages: '<%= path.dist %>/images',
      distScripts: '<%= path.dist %>/scripts',

      doc: 'doc'
    },

    connect: {
      options: {
        hostname: CONNECT_HOST
      },
      app: {
        options: {
          port: CONNECT_PORT,
          middleware: function(connect) {
            return [
              connect.static(require('path').resolve(grunt.config('path.app')))
            ];
          }
        }
      },
      dist: {
        options: {
          port: CONNECT_PORT,
          middleware: function (connect) {
            return [
              connect.static(require('path').resolve(grunt.config('path.dist')))
            ];
          }
        }
      },
      doc: {
        options: {
          livereload: LIVERELOAD_PORT_DOC,
          port: CONNECT_PORT_DOC,
          middleware: function (connect) {
            return [
              connect.static(require('path').resolve(grunt.config('path.doc')))
            ];
          }
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= path.dist %>'
          ]
        }]
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= path.app %>',
          dest: '<%= path.dist %>',
          src: [
            '**/*.html',
            '*.ico',
            '!bower_components/**',
            '!pixi.js/**'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= path.tmpImages %>',
          dest: '<%= path.distImages %>',
          src: [
            '**/*.{png,jpg,gif,svg}'
          ]
        }]
      }
    },

    useminPrepare: {
      html: '<%= path.app %>/index.html',
      options: {
        dest: '<%= path.dist %>'
      }
    },

    filerev: {
      images: {
        src: '<%= path.distImages %>/**/*.{png,jpg,gif,svg}'
      },
      scripts: {
        src: '<%= path.distScripts %>/**/*.js'
      }
    },

    usemin: {
      html: [
        '<%= path.dist %>/**/*.html',
        '!<%= path.dist %>/bower_components/**/*.html'
      ],
      js: ['<%= path.tmpConcatScripts %>/**/*.js'],
      options: {
        assetsDirs: ['<%= path.dist %>'],
        patterns: {
          js: [
            [/(images\/.*\.(png|jpg|gif|svg))/ig, 'Update the JS with the new image filenames']
          ]
        }
      }
    },

    uglify: {
      options: {
        compress: {
          drop_console: true
        }
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.dist %>',
          src: [
            'index.html'
          ],
          dest: '<%= path.dist %>'
        }]
      }
    },

    image: {
      dist: {
        options: {
          pngquant: true,
          optipng: true,
          advpng: true,
          zopflipng: true,
          pngcrush: true,
          pngout: true,
          jpegtran: true,
          jpegRecompress: true,
          jpegoptim: true,
          gifsicle: true,
          svgo: true
        },
        files: [{
          expand: true,
          cwd: '<%= path.appImages %>',
          src: '**/*.{png,jpg,gif,svg}',
          dest: '<%= path.tmpImages %>',
        }]
      }
    },

    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      myCommand: {
        command: 'myCommand'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true,
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          '<%= path.appScripts %>/**/*.js',
          '!<%= path.appScripts %>/vendor/**/*.js'
        ]
      }
    },

    watch: {
      js: {
        files: ['<%= path.appScripts %>/**/*.js'],
        tasks: [
          'jshint'
        ]
      },
      doc: {
        options: {
          livereload: LIVERELOAD_PORT_DOC,
        },
        files: ['<%= path.appScripts %>/**/*.js'],
        tasks: [
          'jsdoc'
        ]
      }
    },

    jsdoc : {
      dist : {
        src: [
          '<%= path.appScripts %>/**/*.js',
          // 'README.md'
        ],
        options: {
          destination: grunt.config('path.doc'),
          template : "jsdoc-template",
          configure : "jsdoc-template/jsdoc.conf.json"
        }
      }
    }

  }); // grunt.initConfig

//--------------------------------------
//  Additional plugin tasks
//--------------------------------------

  // Embed image
  grunt.registerTask('embedImage', 'Embed image files as base64 encode.', function(target) {

    var fs = require('fs');

    var targetPath = target === 'dist' ? grunt.config('path.dist') : grunt.config('path.app');

    var src = targetPath + '/index.html';

    var content = grunt.file.read(src);
    var matches = content.match(/images\/([\w/.@-]*(jpg|png|gif))/ig);

    for(var i = 0; i < matches.length; i++) {
      //grunt.log.writeln(matches[i]);
      var imageFile = targetPath + '/' + matches[i];

      grunt.verbose.writeln(imageFile);
      grunt.verbose.writeln(grunt.file.exists(imageFile));

      if(grunt.file.exists(imageFile)) {
        var bitmap = fs.readFileSync(imageFile);
        var base64Image = new Buffer(bitmap).toString('base64');
        var dataURI = 'data:image/png;base64,' + base64Image;

        grunt.verbose.writeln(dataURI);

        content = content.replace(matches[i], dataURI);

        grunt.log.ok(imageFile + ' converted into data URI');
      }
    }

    grunt.file.write(src, content);
  });

//--------------------------------------
//  Register tasks
//--------------------------------------

  // Serve task
  grunt.registerTask('serve', 'Launch local web server.', function(target) {
    var tasks;

    if (target === 'dist') {
      tasks = [
        'connect:dist:keepalive'
      ];
    } else {
      tasks = [
        'connect:app',
        'watch:js'
      ];
    }

    grunt.task.run(tasks);
  });

  // Build task
  grunt.registerTask('build', 'Minify JS/HTML and revisioning all static files.', function() {
    var tasks = [
      'jshint',
      'clean:dist',
      'newer:image:dist',
      'copy:build',
      'embedImage:dist',
      'useminPrepare',
      'concat',
      // 'filerev:images', // TODO: JS で読み込んでる所のパスが変わらん・・・
      'usemin:js',
      'uglify',
      'filerev:scripts',
      'usemin:html',
      'htmlmin:dist'
    ];

    grunt.task.run(tasks);
  });

  grunt.registerTask('doc', 'Launch document server.', function() {
    var tasks = [
      'connect:doc',
      'watch:doc'
    ];

    grunt.task.run(tasks);
  });

  // Default task
  grunt.registerTask('default', [
    'build'
  ]);

};
