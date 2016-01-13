module.exports = function (grunt) {
  grunt.file.defaultEncoding = "utf8";

  var chalk = require('chalk');
  var pkgJson = require('./package.json');
  var version = new Date().getTime();
  //var version = pkgJson.$version;

  grunt.initConfig({

    "bower-install-simple": {
      options: {
        directory: "<%=baseDir%>/bower_components"
      },
      build: {
        options: {
          production: true,
          forceLatest: true
        }
      }
    },

    requirejs: {
      options: {
        baseUrl: "<%=baseDir%>",
        skipModuleInsertion: false,
        optimizeAllPluginResources: true,
        findNestedDependencies: true
      },

      salaryWidgetCss: {
        options: {
          cssIn: "<%=baseDir%>/app/css/salary-widget.css",
          out: "<%=baseDir%>/app/css/salary-widget.min.css",
          optimizeCss: "standard"
        }
      },
      salaryWidgetJs: {
        options: {
          paths: {
            text: "bower_components/text/text",
            jquery: "bower_components/jquery/dist/jquery",
            ractive: "bower_components/ractive/ractive",
            'amd-loader': "bower_components/rv/amd-loader",
            rv: "bower_components/rv/rv",
            almond: "bower_components/almond/almond"
          },
          name: "bower_components/almond/almond",
          include: ['app/_salaryReviewWidget.js'],
          out: "<%=baseDir%>/salary-review.min.js",
          //optimize: "none",
          stubModules: ['rv', 'amd-loader', 'text']
        }
      },

      skillTrendWidgetCss: {
        options: {
          cssIn: "<%=baseDir%>/app/css/skill-trend.css",
          out: "<%=baseDir%>/app/css/skill-trend.min.css",
          optimizeCss: "standard"
        }
      },
      skillTrendWidgetJs: {
        options: {
          paths: {
            text: "bower_components/text/text",
            jquery: "bower_components/jquery/dist/jquery",
            ractive: "bower_components/ractive/ractive",
            'amd-loader': "bower_components/rv/amd-loader",
            rv: "bower_components/rv/rv",
            almond: "bower_components/almond/almond"
          },
          name: "bower_components/almond/almond",
          include: ['app/_skillTrendWidget.js'],
          out: "<%=baseDir%>/skill-trend.min.js",
          //optimize: "none",
          stubModules: ['rv', 'amd-loader', 'text']
        }
      }
    },

    copy: {
      src: {
        files: [
          {
            cwd: "<%=src%>",
            expand: true,
            src: ["app/**", "demo/**", "embed.min.js", "index.html"],
            dest: "<%=baseDir%>"
          }
        ]
      }
    },

    replace: {
      local: {
        options: {
          patterns: [{
            json: {
              backendUrl: "http://localhost:8080",
              version: version
            }
          }]
        },
        files: {
          "<%=baseDir%>/salary-review.min.js": "<%=baseDir%>/salary-review.min.js",
          "<%=baseDir%>/skill-trend.min.js": "<%=baseDir%>/skill-trend.min.js"
        }
      },

      staging: {
        options: {
          patterns: [{
            json: {
              backendUrl: "http://staging.techlooper.com",
              version: version,
              baseUrl: "http://staging-widget.techlooper.com"
            }
          }]
        },
        files: [
          {cwd: "<%=baseDir%>", expand: true, src: ["**"], dest: "<%=baseDir%>"}
        ]
      },

      prod: {
        options: {
          patterns: [{
            json: {
              backendUrl: "http://techlooper.com",
              version: version,
              baseUrl: "http://widget.techlooper.com"
            }
          }]
        },
        files: [
          {cwd: "<%=baseDir%>", expand: true, src: ["**"], dest: "<%=baseDir%>"}
        ]
      }
    },

    watch: {
      scripts: {files: ["**/*.js", "**/*.json"], options: {livereload: true}},
      markup: {files: ["**/*.html"], options: {livereload: true}},
      stylesheets: {files: ["**/*.css"], options: {livereload: true}}
    },

    connect: {
      server: {
        options: {port: 8000, base: "<%=baseDir%>", keepalive: true}
      }
    },

    compress: {
      target: {
        options: {archive: "techlooper-widget-<%=env%>-<%=version%>.zip"},
        files: [{expand: true, cwd: 'target/', src: ['**']}]
      }
    },

    prompt: {
      build: {
        options: {
          questions: [
            {
              config: "selectedProfile",
              type: "list",
              message: "Please choose a profile to build:",
              choices: [
                {value: "local", name: "Local"},
                {value: "staging", name: "Staging"},
                {value: "staging-run", name: "Staging & start-server"},
                {value: "prod", name: "Production - " + chalk.bold.yellow("LIVE")},
                {value: "exit", name: "Exit"}
              ]
            }
          ]
        }
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask("default", ["prompt:build", "invoke-build"])

  grunt.registerTask("invoke-build", "invoke the build of selected profile", function () {
    var profile = grunt.config("selectedProfile");
    if (profile == "exit") {
      grunt.log.ok("Nothing to build, exit the app!");
      return false;
    }

    grunt.log.ok("Invoke the build of selected profile " + chalk.cyan(profile));
    grunt.task.run(profile);
  });

  grunt.registerTask("clean", "clean last build", function () {
    grunt.file.delete("target");
    grunt.file.delete("bower_components");
    grunt.file.delete("css/*.min.css");
    grunt.file.delete("*.min.js");
  });

  grunt.registerTask("init-target-config", "initialise common config", function () {
    grunt.file.mkdir("target");
    grunt.config("src", ".");
    grunt.config("baseDir", "./target");
    grunt.config("version", version);
    grunt.log.ok("Prepare for the build version " + chalk.cyan(version));
  });

  grunt.registerTask("clear-target", "clean last build", function () {
    grunt.file.delete("target/bower_components");
    grunt.file.delete("target/app");
  });

  grunt.registerTask("build", ["bower-install-simple:build",
    "requirejs:salaryWidgetCss", "requirejs:salaryWidgetJs",
    "requirejs:skillTrendWidgetCss", "requirejs:skillTrendWidgetJs"
  ]);
  grunt.registerTask("build-target", ["build", "clear-target", "compress:target"]);
  grunt.registerTask("run", ["connect", "watch"]);

  grunt.registerTask("staging-run", ["staging", "run"]);

  grunt.registerTask("local", "build dev env", function () {//build local
    grunt.config("baseDir", ".");
    grunt.log.ok("Building" + chalk.cyan(" LOCAL ") + "environment");
    grunt.task.run(["clean", "build", "replace:local", "run"]);
  });

  grunt.registerTask("staging", "build staging env", function () {//build staging
    grunt.task.run("init-target-config");
    grunt.config("env", "staging");
    grunt.log.ok("Building" + chalk.cyan(" STAGING ") + "environment");
    grunt.task.run(["clean", "copy:src", "replace:staging", "build-target"]);
  });

  grunt.registerTask("prod", "build prod env", function () {//build prod
    grunt.task.run("init-target-config");
    grunt.config("env", "prod");
    grunt.log.ok("Building" + chalk.cyan(" PRODUCTION ") + "environment");
    grunt.task.run(["clean", "copy:src", "replace:prod", "build-target"]);
  });
};