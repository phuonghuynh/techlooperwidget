module.exports = function (grunt) {
  var timestamp = Date.now();

  grunt.file.defaultEncoding = "utf8";
  //grunt.file.delete("target");
  //grunt.file.mkdir("target");
  //grunt.file.setBase("target");

  grunt.initConfig({
    //pkg: grunt.file.readJSON("package.json"),

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
      js: {
        options: {
          paths: {
            text: "bower_components/text/text",
            jquery: "bower_components/jQuery/dist/jquery",
            ractive: "bower_components/ractive/ractive",
            'amd-loader': "bower_components/rv/amd-loader",
            rv: "bower_components/rv/rv",
            almond: "bower_components/almond/almond"
          },
          //name: "bower_components/almond/almond",
          almond: true,
          include: ['app/_main.js'],
          out: "embed.min.js",
          optimize: "none",
          stubModules: ['rv', 'amd-loader', 'text']
        }
      },
      css: {
        options: {
          cssIn: "css/my-widget.css",
          out: "css/my-widget_embed.css",
          optimizeCss: "standard"
        }
      }
    },

    copy: {
      src: {
        files: [
          {
            cwd: "<%=src%>",
            expand: true,
            src: ["**", "!node_modules/"],
            //src: ["'**',  '!**/node_modules/**'"],
            dest: "<%=baseDir%>"
          }
        ]
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.task.registerTask("clean", "clean last build", function () {
    grunt.file.delete("target");
    grunt.file.delete("bower_components");
    grunt.file.delete("css/my-widget_embed.css");
    grunt.file.delete("embed.min.js");
  });

  grunt.registerTask("build", ["bower-install-simple:build", "requirejs:js", "requirejs:css"]);

  grunt.task.registerTask("local", "build dev env", function () {
    grunt.config("baseDir", ".");
    grunt.task.run(["clean", "build"]);
  });

  grunt.task.registerTask("staging", "build staging env", function () {
    grunt.file.mkdir("target");
    grunt.config("src", ".");
    grunt.config("baseDir", "./target");
    grunt.task.run(["clean", "copy:src"]);
  });

  // start a http server and serve at folder "assets"
  //grunt.registerTask("run", ["connect", "watch"]);
};